import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { MaterialCommunityIcons, Feather, AntDesign } from '@expo/vector-icons';
import { firestore, auth } from '../model/firebase';
import { collection, getDocs, query, where, getDoc, doc, orderBy } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { useTranslation } from 'react-i18next';

export default function HomeScreen({navigation} : {navigation: any}) {
    const {t} = useTranslation();
    const [memories, setMemories] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isNewestFirst, setIsNewestFirst] = useState(true);
    const currentUser = auth.currentUser;
    const { state, dispatch } = useUser();
    const { user } = state;

    useEffect(() => {
        const fetchUserData = async () => {
            if(currentUser){
                const userDoc = await getDoc(doc(firestore, 'Users', currentUser.uid));
                if(userDoc.exists()){
                    const userData = userDoc.data();
                    dispatch({ 
                        type: 'SET_USER', 
                        payload: {
                            name: userData.name || '',
                            surname: userData.surname || '',
                            email: userData.email || '',
                            password: userData.password || '',
                            profileImage: userData.profileImage || null,
                    } });
                }
            }
        }
        fetchUserData();
    }, [dispatch]);

    const fetchMemories = async () => {
        if(currentUser){
            const q = query(
                collection(firestore, 'Memories'), 
                where('email', '==', currentUser.email),
            );
            const querySnapshot = await getDocs(q);
            const memoriesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMemories(memoriesData);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchMemories();
        }, [currentUser])
    );

    const handleSearch = async (text: string) => {
        setSearchTerm(text);

        if (text.trim() === '') {
            fetchMemories();
        } else {
            const searchTermLower = text.toLowerCase().trim();
            const filteredMemories = memories.filter(memory => {
                const titleLower = memory.title.toLowerCase();
                return titleLower.includes(searchTermLower);
            });
            setMemories(filteredMemories);
        }
    };

    const renderItem = ({item}: {item:any}) => {
        return (
            <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate('Memory', { memory: item })}>
                <Image source={{ uri: item.imageUrl }} style={styles.image}/>
                <View style={styles.info}>
                    <Text style={styles.cityText}>{item.title}, {item.location.city}</Text>
                    <Text style={styles.cityText}>{<AntDesign name="star" size={14} color="black" />}{item.score}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    const byDate = async () => {
        if (currentUser) {
            const q = query(
                collection(firestore, 'Memories'),
                where('email', '==', currentUser.email),
                orderBy('timestamp', isNewestFirst ? 'desc' : 'asc')
            );
            const querySnapshot = await getDocs(q);
            const sortedMemories = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMemories(sortedMemories);
            setIsNewestFirst(!isNewestFirst);
        }
    }

    const byScore = async () => {
        if(currentUser) {
            const q = query(
                collection(firestore, 'Memories'),
                where('email', '==', currentUser.email),
                orderBy('score', isNewestFirst ? 'desc': 'asc')
            );
            const querySnapshot = await getDocs(q);
            const sortedMemories = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMemories(sortedMemories);
            setIsNewestFirst(!isNewestFirst);
        }
    }

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1, backgroundColor: "#DCE9F2" }}
            behavior={Platform.OS === 'ios' ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}>
                <View style={styles.keyContainer}>
                    <View style={styles.header}>
                        <Text style={styles.text}>{t('hello')} {user?.name}</Text>
                        <MaterialCommunityIcons style={styles.icon} name="hand-wave" size={24} color="black" />
                    </View>
                    <TextInput 
                        style={styles.input} 
                        placeholder={t('searchMemory')} 
                        value={searchTerm}
                        onChangeText={handleSearch}
                    />
                    <Text style={styles.text}>{t('memories')}</Text>
                    <View style={styles.buttonView}>
                        <TouchableOpacity style={styles.button} onPress={byDate}>
                            <Text style={styles.buttonText}>{t('byDate')}</Text>
                        </TouchableOpacity>
                        <Text>    </Text>
                        <TouchableOpacity style={styles.button} onPress={byScore}>
                            <Text style={styles.buttonText}>{t('byScore')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.container1}>
                {memories.length > 0 ? (
                    <FlatList 
                        data={memories}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={styles.horizontalList}
                    />
                ) : (
                    <Text style={styles.noMemoriesText}>{t('notFoundMemories')}</Text>
                )}
                </View>
                <View style={styles.container2}>
                    <View style={styles.tabbar}>
                        <TouchableOpacity onPress={() => navigation.navigate('Map', {memories: memories})}>
                            <Feather name="map" size={32} color="black"/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Camera')}>
                            <Feather name="camera" size={32} color="black"/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                            <Feather name="user" size={32} color="black"/>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#DCE9F2",
    },
    keyContainer: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 20,
    },
    container1: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        alignSelf: 'center',
        marginTop: 20,
        height: 374,
    },
    container2: {
        width: '100%',
        backgroundColor: '#B1C9DA',
        justifyContent: 'center',
        paddingVertical: 10,
        marginTop: 20,
        position: 'static'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        fontSize: 30,
        marginVertical: 20,
    },
    icon: {
        marginTop: 30,
    },
    buttonView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    input: {
        backgroundColor: '#99B6B6',
        fontSize: 16,
        borderRadius: 15,
        height: 50,
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#99B6B6',
        width: '40%',
        height: 35,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
    },
    tabbar: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    itemContainer: {
        marginRight: 20,
    },
    image: {
        width: 220,
        height: 320,
        borderRadius: 10,
        marginTop: 16,
    },
    noMemoriesText: {
        fontSize: 18,
        color: '#333',
        alignSelf: 'center',
        marginTop: 20,
    },
    cityText: {
        marginVertical: 8,
        fontSize: 16,
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 220,
    },
    horizontalList: {
        paddingHorizontal: 10,
    },
});
