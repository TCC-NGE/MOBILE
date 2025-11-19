import { db } from '../config/firebaseConfig';
import { collection, doc, getDoc, setDoc, addDoc, query, where, orderBy, limit, getDocs, updateDoc, increment, Timestamp } from 'firebase/firestore';

export const criarCarteira = async (userId, tipoCartao) => {
    try {
        const carteiraRef = doc(db, 'carteiras', userId);
        await setDoc(carteiraRef, {
            userId,
            tipoCartao,
            saldo: 0,
            criadoEm: Timestamp.now(),
            atualizadoEm: Timestamp.now()
        });
        return { success: true };
    } catch (error) {
        console.error('Erro ao criar carteira:', error);
        throw error;
    }
};

export const obterCarteira = async (userId) => {
    try {
        const carteiraRef = doc(db, 'carteiras', userId);
        const carteiraDoc = await getDoc(carteiraRef);
        
        if (!carteiraDoc.exists()) {
            await criarCarteira(userId);
            return { userId, tipoCartao: 'comum', saldo: 0 };
        }
        
        return { id: carteiraDoc.id, ...carteiraDoc.data() };
    } catch (error) {
        console.error('Erro ao obter carteira:', error);
        throw error;
    }
};

export const recarregarCarteira = async (userId, valor) => {
    try {
        if (valor <= 0) {
            throw new Error('Valor inválido');
        }

        const carteiraRef = doc(db, 'carteiras', userId);
        const carteiraDoc = await getDoc(carteiraRef);
        
        if (!carteiraDoc.exists()) {
            throw new Error('Carteira não encontrada');
        }

        const saldoAtual = carteiraDoc.data().saldo || 0;
        const novoSaldo = saldoAtual + valor;

        await updateDoc(carteiraRef, {
            saldo: novoSaldo,
            atualizadoEm: Timestamp.now()
        });

        await addDoc(collection(db, 'transacoes'), {
            userId,
            tipo: 'recarga',
            valor,
            timestamp: Timestamp.now(),
            saldoAnterior: saldoAtual,
            saldoNovo: novoSaldo
        });

        return { success: true, novoSaldo };
    } catch (error) {
        console.error('Erro ao recarregar carteira:', error);
        throw error;
    }
};

export const validarViagem = async (userId, linha, empresa) => {
    try {
        const carteiraRef = doc(db, 'carteiras', userId);
        const carteiraDoc = await getDoc(carteiraRef);
        
        if (!carteiraDoc.exists()) {
            throw new Error('Carteira não encontrada');
        }

        const carteira = carteiraDoc.data();
        const tarifas = {
            comum: 5.75,
            universitario: 2.25,
            escolar: 2.30,
            idoso: 1.00
        };
        
        const tarifa = tarifas[carteira.tipoCartao] || tarifas.comum;

        if (carteira.saldo < tarifa) {
            throw new Error('Saldo insuficiente');
        }

        const novoSaldo = carteira.saldo - tarifa;

        await updateDoc(carteiraRef, {
            saldo: novoSaldo,
            atualizadoEm: Timestamp.now()
        });

        const viagemRef = await addDoc(collection(db, 'viagens'), {
            userId,
            linha,
            empresa,
            valor: tarifa,
            tipoCartao: carteira.tipoCartao,
            timestamp: Timestamp.now(),
            status: 'validada'
        });

        return {
            success: true,
            viagem: { id: viagemRef.id },
            novoSaldo
        };
    } catch (error) {
        console.error('Erro ao validar viagem:', error);
        throw error;
    }
};

export const obterHistoricoViagens = async (userId) => {
    try {
        const viagensQuery = query(
            collection(db, 'viagens'),
            where('userId', '==', userId),
            orderBy('timestamp', 'desc'),
            limit(50)
        );

        const snapshot = await getDocs(viagensQuery);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Erro ao obter histórico:', error);
        return [];
    }
};

export const obterEstatisticasUsuario = async (userId) => {
    try {
        const viagensQuery = query(
            collection(db, 'viagens'),
            where('userId', '==', userId)
        );

        const snapshot = await getDocs(viagensQuery);
        const totalViagens = snapshot.size;
        const totalGasto = snapshot.docs.reduce((sum, doc) => sum + (doc.data().valor || 0), 0);

        return {
            totalViagens,
            totalGasto,
            mediaGasto: totalViagens > 0 ? totalGasto / totalViagens : 0
        };
    } catch (error) {
        console.error('Erro ao obter estatísticas:', error);
        return { totalViagens: 0, totalGasto: 0, mediaGasto: 0 };
    }
};

export const alterarTipoCartao = async (userId, novoTipo) => {
    try {
        const carteiraRef = doc(db, 'carteiras', userId);
        await updateDoc(carteiraRef, {
            tipoCartao: novoTipo,
            atualizadoEm: Timestamp.now()
        });
        return { success: true };
    } catch (error) {
        console.error('Erro ao alterar tipo de cartão:', error);
        throw error;
    }
};

