import { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { recarregarCarteira } from '../services/firestoreService';
import { COLORS, cores } from '../constants/colors';

export default function Recarga({ navigation, route }) {
    const [valor, setValor] = useState('');
    const [carregando, setCarregando] = useState(false);
    const { userId, saldoAtual } = route.params;

    const valoresRapidos = [10, 20, 50, 100];

    const handleRecarga = async () => {
        const valorNumerico = parseFloat(valor);
        
        if (isNaN(valorNumerico) || valorNumerico <= 0) {
            Alert.alert('Erro', 'Digite um valor válido para recarga');
            return;
        }

        try {
            setCarregando(true);
            await recarregarCarteira(userId, valorNumerico);
            Alert.alert(
                'Sucesso', 
                `Recarga de R$ ${valorNumerico.toFixed(2)} realizada com sucesso!`,
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            Alert.alert('Erro', error.message || 'Não foi possível realizar a recarga');
        } finally {
            setCarregando(false);
        }
    };

    const selecionarValorRapido = (valorRapido) => {
        setValor(valorRapido.toString());
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botaoVoltar}>
                    <Text style={styles.textoVoltar}>← Voltar</Text>
                </TouchableOpacity>
                <Text style={styles.headerText}>Recarregar Saldo</Text>
            </View>

            <View style={styles.conteudo}>
                <View style={styles.saldoAtualCard}>
                    <Text style={styles.saldoLabel}>Saldo Atual</Text>
                    <Text style={styles.saldoValor}>R$ {saldoAtual?.toFixed(2) || '0.00'}</Text>
                </View>

                <Text style={styles.label}>Valor da Recarga</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite o valor"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    value={valor}
                    onChangeText={setValor}
                />

                <Text style={styles.valoresRapidosLabel}>Valores Rápidos</Text>
                <View style={styles.valoresRapidosGrid}>
                    {valoresRapidos.map((valorRapido) => (
                        <TouchableOpacity
                            key={valorRapido}
                            style={[
                                styles.valorRapidoCard,
                                valor === valorRapido.toString() && styles.valorRapidoSelecionado
                            ]}
                            onPress={() => selecionarValorRapido(valorRapido)}
                        >
                            <Text style={styles.valorRapidoTexto}>R$ {valorRapido}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {valor && !isNaN(parseFloat(valor)) && parseFloat(valor) > 0 && (
                    <View style={styles.previewCard}>
                        <Text style={styles.previewLabel}>Novo Saldo</Text>
                        <Text style={styles.previewValor}>
                            R$ {(saldoAtual + parseFloat(valor)).toFixed(2)}
                        </Text>
                    </View>
                )}

                <TouchableOpacity
                    style={[styles.botaoRecarga, carregando && styles.botaoDesabilitado]}
                    onPress={handleRecarga}
                    disabled={carregando}
                >
                    {carregando ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.botaoTexto}>Confirmar Recarga</Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.avisoSimulacao}>
                    💳 Esta é uma simulação para o TCC. Em produção, seria integrado com gateway de pagamento real.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.secondary,
    },
    header: {
        backgroundColor: COLORS.primary,
        padding: 20,
        paddingTop: 50,
    },
    botaoVoltar: {
        marginBottom: 10,
    },
    textoVoltar: {
        color: '#fff',
        fontSize: 16,
    },
    headerText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    conteudo: {
        padding: 20,
    },
    saldoAtualCard: {
        backgroundColor: COLORS.secondary,
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 20,
    },
    saldoLabel: {
        color: '#ccc',
        fontSize: 14,
        marginBottom: 5,
    },
    saldoValor: {
        color: '#4CAF50',
        fontSize: 32,
        fontWeight: 'bold',
    },
    label: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: COLORS.secondary,
        color: '#fff',
        borderRadius: 10,
        marginBottom: 20,
    },
    valoresRapidosLabel: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    valoresRapidosGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    valorRapidoCard: {
        backgroundColor: COLORS.secondary,
        flex: 1,
        marginHorizontal: 5,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    valorRapidoSelecionado: {
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(12, 30, 52, 0.8)',
    },
    valorRapidoTexto: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    previewCard: {
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    previewLabel: {
        color: '#4CAF50',
        fontSize: 14,
        marginBottom: 5,
    },
    previewValor: {
        color: '#4CAF50',
        fontSize: 28,
        fontWeight: 'bold',
    },
    botaoRecarga: {
        backgroundColor: COLORS.primary,
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 15,
    },
    botaoDesabilitado: {
        opacity: 0.6,
    },
    botaoTexto: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    avisoSimulacao: {
        color: '#888',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 10,
    },
});

