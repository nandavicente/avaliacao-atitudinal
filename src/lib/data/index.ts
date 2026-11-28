import { MOCK_STUDENTS } from "./students";

const MOCK_DELAY_MS = 750;
function delay(ms: number): Promise<void>{
    return new Promise((resolve) =>{
        setTimeout(resolve,ms);//finaliza a Promise dps do tempo informado
    });
}

//retorna todos os estudantes cadastrados no mock
export async function listStudents(){//async é assincrona e sempre retorna uma promise
    await delay(MOCK_DELAY_MS);//aguarda a conclusao da promise pra continuar
    return MOCK_STUDENTS.map((student) => ({...student}));//op spread pra copiar as propriedades de cada objeto
    //cria um novo array e uma copia de cada estudante
}

//busca um estudante a partir do seu id
export async function getStudent(id:string){
    await delay(MOCK_DELAY_MS) //simula o tempo de respost da consulta

    const student = MOCK_STUDENTS.find((student) => student.id === id);//percorre o array procurando um id correspondente
    
    if(!student)
        return null
    
    return {...student}//retorna uma copia do objt encontrado
}