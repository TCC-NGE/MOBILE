import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import nfcManager, { NfcTech } from "react-native-nfc-manager";

nfcManager.start();

export default function Nfc({ navigation }){
    async function readNdef(params) {
        try {
            await nfcManager.requestTechnology(NfcTech.Ndef);
            const tag = await nfcManager.getTag();
            console.warn('Tag found', tag);
        } catch (ex) {
           console.warn('Oops!', ex); 
        } finally {
            nfcManager.cancelTechnologyRequest();
        }
    }

    return(
        <View style={styles.wrapper}>
            <TouchableOpacity>
                <Text>Scan a Tag</Text>
            </TouchableOpacity>
        </View>
    );

    
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
}) 