import { useState, useEffect } from 'react';
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { obterHistoricoViagens } from '../services/firestoreService';
import { COLORS, cores } from '../constants/colors';

export default function Historico({ navigation, route }) {
    const [historico, setHistorico] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const { userId } = route.params;

    const carregarHistorico = async () => {
        try {
            setCarregando(true);
            const dados = await obterHistoricoViagens(userId);
            setHistorico(dados);
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
        } finally {
            setCarregando(false);
        }
    };

    const atualizarHistorico = async () => {
        setAtualizando(true);
        await carregarHistorico();
        setAtualizando(false);
    };

    useEffect(() => {
        carregarHistorico();
    }, []);

    const calcularTotais = () => {
        const totalViagens = historico.length;
        const totalGasto = historico.reduce((sum, viagem) => sum + (viagem.valor || 0), 0);
        return { totalViagens, totalGasto };
    };

    const { totalViagens, totalGasto } = calcularTotais();

    if (carregando) {
        return (
            <View style={styles.containerCentro}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botaoVoltar}>
                    <Text style={styles.textoVoltar}>← Voltar</Text>
                </TouchableOpacity>
                <Text style={styles.headerText}>Histórico de Viagens</Text>
            </View>

            <View style={styles.totaisCard}>
                <View style={styles.totalItem}>
                    <Text style={styles.totalLabel}>Total de Viagens</Text>
                    <Text style={styles.totalValor}>3</Text>
                </View>
                <View style={styles.divisor} />
                <View style={styles.totalItem}>
                    <Text style={styles.totalLabel}>Total Gasto</Text>
                    <Text style={[styles.totalValor, { color: '#FF6B6B' }]}>
                        R$ 17,60
                    </Text>
                </View>
            </View>

            <ScrollView
                 style={styles.listaContainer}
                 refreshControl={
                     <RefreshControl refreshing={atualizando} onRefresh={atualizarHistorico} />
                     }
                     >
                        <View style={styles.viagemCard}>
                            <View style={styles.viagemHeader}>
                                <View style={styles.viagemIcone}>
                                    <Text style={styles.viagemIconeTexto}>🚍</Text>
                                </View>
                                <View style={styles.viagemInfo}>
                                    <Text style={styles.viagemLinha}>Linha 280</Text>
                                    <Text style={styles.viagemEmpresa}> Transurc</Text>
                                </View>
                                <View style={styles.viagemValorContainer}>
                                    <Text style={styles.viagemValor}>- R$ 5,70</Text>
                                    <Text style={styles.viagemTipo}></Text>
                                </View>
                            </View>
                            <View style={styles.viagemFooter}>
                                <Text style={styles.viagemData}>
                                    📅 02/11/25
                                </Text>
                                <View style={styles.viagemStatus}>
                                    <View style={styles.statusIndicador} />
                                    <Text style={styles.statusTexto}> Validada </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.viagemCard}>
                            <View style={styles.viagemHeader}>
                                <View style={styles.viagemIcone}>
                                    <Text style={styles.viagemIconeTexto}>🚍</Text>
                                </View>
                                <View style={styles.viagemInfo}>
                                    <Text style={styles.viagemLinha}>Linha 674</Text>
                                    <Text style={styles.viagemEmpresa}> EMTU</Text>
                                </View>
                                <View style={styles.viagemValorContainer}>
                                    <Text style={styles.viagemValor}>- R$ 6,20</Text>
                                    <Text style={styles.viagemTipo}></Text>
                                </View>
                            </View>
                            <View style={styles.viagemFooter}>
                                <Text style={styles.viagemData}>
                                    📅 25/10/25
                                </Text>
                                <View style={styles.viagemStatus}>
                                    <View style={styles.statusIndicador} />
                                    <Text style={styles.statusTexto}> Validada </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.viagemCard}>
                            <View style={styles.viagemHeader}>
                                <View style={styles.viagemIcone}>
                                    <Text style={styles.viagemIconeTexto}>🚍</Text>
                                </View>
                                <View style={styles.viagemInfo}>
                                    <Text style={styles.viagemLinha}>Linha 260</Text>
                                    <Text style={styles.viagemEmpresa}> Transurc</Text>
                                </View>
                                <View style={styles.viagemValorContainer}>
                                    <Text style={styles.viagemValor}>- R$ 5,70</Text>
                                    <Text style={styles.viagemTipo}></Text>
                                </View>
                            </View>
                            <View style={styles.viagemFooter}>
                                <Text style={styles.viagemData}>
                                    📅 11/10/25
                                </Text>
                                <View style={styles.viagemStatus}>
                                    <View style={styles.statusIndicador} />
                                    <Text style={styles.statusTexto}> Validada </Text>
                                </View>
                            </View>
                        </View>
                     {/*
                {historico.length === 0 ? (
                    <View style={styles.semDados}>
                        <Text style={styles.semDadosIcone}>🚌</Text>
                        <Text style={styles.semDadosTexto}>Nenhuma viagem registrada</Text>
                        <Text style={styles.semDadosSubtexto}>
                            Suas viagens aparecerão aqui após validação
                        </Text>
                    </View>
                ) : (
                    historico.map((viagem, index) => (
                        <View key={index} style={styles.viagemCard}>
                            <View style={styles.viagemHeader}>
                                <View style={styles.viagemIcone}>
                                    <Text style={styles.viagemIconeTexto}>🚍</Text>
                                </View>
                                <View style={styles.viagemInfo}>
                                    <Text style={styles.viagemLinha}>Linha {viagem.linha}</Text>
                                    <Text style={styles.viagemEmpresa}>{viagem.empresa}</Text>
                                </View>
                                <View style={styles.viagemValorContainer}>
                                    <Text style={styles.viagemValor}>- R$ {viagem.valor?.toFixed(2)}</Text>
                                    <Text style={styles.viagemTipo}>{viagem.tipoCartao}</Text>
                                </View>
                            </View>
                            <View style={styles.viagemFooter}>
                                <Text style={styles.viagemData}>
                                    📅 {formatarDataCompleta(viagem.timestamp)}
                                </Text>
                                <View style={styles.viagemStatus}>
                                    <View style={styles.statusIndicador} />
                                    <Text style={styles.statusTexto}>{viagem.status || 'validada'}</Text>
                                </View>
                            </View>
                        </View>
                    ))
                )} */}
            </ScrollView> 
        </View>
    );
}

function formatarDataCompleta(timestamp) {
    if (!timestamp) return '';
    const data = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, '0');
    const minuto = String(data.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} às ${hora}:${minuto}`;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.secondary,
    },
    containerCentro: {
        flex: 1,
        backgroundColor: COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
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
    totaisCard: {
        backgroundColor: COLORS.secondary,
        margin: 15,
        padding: 20,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-around',
        elevation: 3,
    },
    totalItem: {
        alignItems: 'center',
    },
    totalLabel: {
        color: '#888',
        fontSize: 12,
        marginBottom: 5,
    },
    totalValor: {
        color: '#4CAF50',
        fontSize: 24,
        fontWeight: 'bold',
    },
    divisor: {
        width: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    listaContainer: {
        flex: 1,
        padding: 15,
        paddingTop: 0,
    },
    semDados: {
        backgroundColor: COLORS.secondary,
        padding: 40,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    semDadosIcone: {
        fontSize: 64,
        marginBottom: 20,
    },
    semDadosTexto: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    semDadosSubtexto: {
        color: '#888',
        fontSize: 14,
        textAlign: 'center',
    },
    viagemCard: {
        backgroundColor: COLORS.secondary,
        padding: 15,
        borderRadius: 15,
        marginBottom: 10,
        elevation: 2,
    },
    viagemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    viagemIcone: {
        backgroundColor: 'rgba(12, 30, 52, 0.5)',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    viagemIconeTexto: {
        fontSize: 24,
    },
    viagemInfo: {
        flex: 1,
    },
    viagemLinha: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    viagemEmpresa: {
        color: '#888',
        fontSize: 14,
        marginTop: 2,
    },
    viagemValorContainer: {
        alignItems: 'flex-end',
    },
    viagemValor: {
        color: '#FF6B6B',
        fontSize: 18,
        fontWeight: 'bold',
    },
    viagemTipo: {
        color: '#888',
        fontSize: 12,
        marginTop: 2,
    },
    viagemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    viagemData: {
        color: '#888',
        fontSize: 12,
    },
    viagemStatus: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIndicador: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4CAF50',
        marginRight: 5,
    },
    statusTexto: {
        color: '#4CAF50',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

