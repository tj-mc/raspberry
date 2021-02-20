import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

export const Example = () => {
    const x = true;
    const [textState, setTextState] = useState('This is React Native Code');
    return (
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            {
                x === true &&
                <TouchableOpacity onPress={() => setTextState('Generated with Raspberry')}>
                    <Text style={{textAlign: 'center'}} numberOflines={1}>
                        Welcome to {textState}
                    </Text>
                </TouchableOpacity>
            }
        </View>
    )
}