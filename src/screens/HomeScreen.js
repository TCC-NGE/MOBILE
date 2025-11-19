import { useState, useEffect } from 'react';
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { obterCarteira } from '../services/firestoreService';
import { obterHistoricoViagens } from '../services/firestoreService';
import { COLORS } from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import { Icon } from 'react-native-vector-icons/Ionicons';


export default function HomeScreen({ navigation, route }) {
    const [carteira, setCarteira] = useState(null);
    const [historico, setHistorico] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    
    const userId = route.params?.userId;

    const carregarDados = async () => {
        try {
            setCarregando(true);
            const dadosCarteira = await obterCarteira(userId);
            const dadosHistorico = await obterHistoricoViagens(userId);
            setCarteira(dadosCarteira);
            setHistorico(dadosHistorico.slice(0, 5));
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setCarregando(false);
        }
    };

    const atualizarDados = async () => {    
        setAtualizando(true);
        await carregarDados();
        setAtualizando(false);
    };

    useEffect(() => {
        carregarDados();
    }, []);

    const navegarParaRecarga = () => {
        navigation.navigate('Recarga', { userId, saldoAtual: carteira?.saldo });
    };

    const navegarParaHistorico = () => {
        navigation.navigate('Historico', { userId });
    };

    const navegarParaCard = () => {
        navigation.navigate('Card');
    };

    const handleLogout = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    if (carregando) {
        return (
            <View style={styles.containerCentro}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <ScrollView 
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={atualizando} onRefresh={atualizarDados} />
            }
        >
            <View style={styles.header}>
                <Text style={styles.headerText}>NGE Transportes</Text>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Sair</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.carteiraCard}>
                <Text style={styles.carteiraTitle}>Minha Carteira</Text>
                <View style={styles.saldoContainer}>
                    <Text style={styles.saldoLabel}>Saldo Disponível</Text>
                    <Text style={styles.saldoValor}>R$ {carteira?.saldo?.toFixed(2) || '50.00'}</Text>
                </View>
                <View style={styles.infoCarteira}>
                    <Text style={styles.infoText}>Tipo: {carteira?.tipoCartao || 'comum'}</Text>
                    <Text style={styles.infoText}>Tarifa: R$ {obterTarifa(carteira?.tipoCartao)}</Text>
                </View>
                <TouchableOpacity style={styles.botaoRecarga} onPress={navegarParaRecarga}>
                    <Text style={styles.botaoTexto}>Recarregar Saldo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botaoSecundario} onPress={navegarParaCard}>
                    <Text style={styles.botaoTexto}>Ver Cartão Virtual</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.historicoCard}>
                <View style={styles.historicoHeader}>
                    <Text style={styles.historicoTitle}>Últimas Viagens</Text>
                    <TouchableOpacity onPress={navegarParaHistorico}>
                        <Text style={styles.verTodosLink}>Ver todos</Text>
                    </TouchableOpacity>
                </View>
                
                {historico.length === 0 ? (
                    <View style={styles.semDados}>
                        <Text style={styles.semDadosTexto}>Nenhuma viagem registrada</Text>
                    </View>
                ) : (
                    historico.map((viagem, index) => (
                        <View key={index} style={styles.viagemItem}>
                            <View style={styles.viagemInfo}>
                                <Text style={styles.viagemLinha}>Linha {viagem.linha}</Text>
                                <Text style={styles.viagemEmpresa}>{viagem.empresa}</Text>
                            </View>
                            <View style={styles.viagemDetalhes}>
                                <Text style={styles.viagemValor}>- R$ {viagem.valor?.toFixed(2)}</Text>
                                <Text style={styles.viagemData}>{formatarData(viagem.timestamp)}</Text>
                            </View>
                        </View>
                    ))
                )}
            </View>

            <View style={styles.acoesRapidas}>
                <Text style={styles.acoesTitle}>Ações Rápidas</Text>
                <View style={styles.acoesGrid}>
                    <TouchableOpacity style={styles.acaoCard} onPress={navegarParaHistorico}>
                        <Ionicons name="bar-chart" size={40} color={"#fff"}></Ionicons>
                        <Text style={styles.acaoTexto}>Histórico</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.acaoCard} onPress={navegarParaRecarga}>
                        <Ionicons name="cash" size={40} color={"#fff"}></Ionicons>
                        <Text style={styles.acaoTexto}>Recarga</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.acaoCard} onPress={navegarParaCard}>
                        <Ionicons name="card" size={40} color={"#fff"}></Ionicons>
                        <Text style={styles.acaoTexto}>Cartão</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

function obterTarifa(tipoCartao) {
    const tarifas = {
        comum: '5.70',
        universitario: '2.35',
        escolar: '2.47',
        idoso: '1.00'
    };
    return tarifas[tipoCartao] || '5.70';
} 

function formatarData(timestamp) {
    if (!timestamp) return '';
    const data = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const hora = String(data.getHours()).padStart(2, '0');
    const minuto = String(data.getMinutes()).padStart(2, '0');
    return `${dia}/${mes} ${hora}:${minuto}`;
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    logoutText: {
        color: '#fff',
        fontSize: 14,
    },
    carteiraCard: {
        backgroundColor: COLORS.secondary,
        margin: 15,
        padding: 20,
        borderRadius: 15,
        elevation: 3,
    },
    carteiraTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    saldoContainer: {
        alignItems: 'center',
        marginVertical: 15,
    },
    saldoLabel: {
        color: '#ccc',
        fontSize: 14,
        marginBottom: 5,
    },
    saldoValor: {
        color: '#4CAF50',
        fontSize: 36,
        fontWeight: 'bold',
    },
    infoCarteira: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    infoText: {
        color: '#ccc',
        fontSize: 14,
    },
    botaoRecarga: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
    },
    botaoSecundario: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
    },
    botaoTexto: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    historicoCard: {
        backgroundColor: COLORS.secondary,
        margin: 15,
        marginTop: 0,
        padding: 20,
        borderRadius: 15,
        elevation: 3,
    },
    historicoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    historicoTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    verTodosLink: {
        color: COLORS.primary,
        fontSize: 14,
    },
    semDados: {
        padding: 20,
        alignItems: 'center',
    },
    semDadosTexto: {
        color: '#888',
        fontSize: 14,
    },
    viagemItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    viagemInfo: {
        flex: 1,
    },
    viagemLinha: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    viagemEmpresa: {
        color: '#888',
        fontSize: 12,
        marginTop: 2,
    },
    viagemDetalhes: {
        alignItems: 'flex-end',
    },
    viagemValor: {
        color: '#FF6B6B',
        fontSize: 16,
        fontWeight: 'bold',
    },
    viagemData: {
        color: '#888',
        fontSize: 12,
        marginTop: 2,
    },
    acoesRapidas: {
        margin: 15,
        marginTop: 25,
    },
    acoesTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    acoesGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    acaoCard: {
        backgroundColor: COLORS.secondary,
        flex: 1,
        marginHorizontal: 5,
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        elevation: 3,
    },
    acaoIcone: {
        fontSize: 32,
        marginBottom: 10,
    },
    acaoTexto: {
        marginTop:10,
        color: '#fff',
        fontSize: 14,
    },
});