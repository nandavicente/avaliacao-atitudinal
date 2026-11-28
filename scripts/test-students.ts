// Importações
import { strict as assert } from "node:assert";
import { listStudents, getStudent } from "../src/lib/data";
import { MOCK_STUDENTS } from "../src/lib/data/students";

// Função principal responsável pela execução dos testes
async function executarTestes() {
  console.log("Iniciando os testes...\n");

  // TESTE 1 - Listagem de estudantes
  const estudantes = await listStudents();

  assert.equal(estudantes.length, 15);

  console.log("[OK] Listagem de estudantes");
  console.log("Total:", estudantes.length);

  // TESTE 2 - Busca por estudante existente
  const idExistente = "a3b8c1d2-4e5f-4a67-8b90-123456789001";

  const estudante = await getStudent(idExistente);

  assert.ok(estudante !== null);
  assert.equal(estudante.id, idExistente);
  assert.equal(estudante.name, "Ana Clara Silva");

  console.log("\n[OK] Busca por estudante existente");
  console.log("Estudante:", estudante.name);

  // TESTE 3 - Busca por estudante inexistente
  const idInexistente = "a3b8c1d2-4e5f-4a67-8b90-123456789999";

  const resultado = await getStudent(idInexistente);

  assert.equal(resultado, null);

  console.log("\n[OK] Busca por estudante inexistente");
  console.log("Resultado:", resultado);

  // TESTE 4 - Latência simulada de listStudents
  const inicioLista = performance.now();

  await listStudents();

  const tempoLista = performance.now() - inicioLista;

  assert.ok(tempoLista >= 500);

  console.log("\n[OK] Latência de listStudents");
  console.log(`${tempoLista.toFixed(2)} ms`);

  if (tempoLista > 1000) {
    console.warn("Tempo acima de 1000 ms.");
  }

  // TESTE 5 - Latência simulada de getStudent
  const inicioBusca = performance.now();

  await getStudent(idExistente);

  const tempoBusca = performance.now() - inicioBusca;

  assert.ok(tempoBusca >= 500);

  console.log("\n[OK] Latência de getStudent");
  console.log(`${tempoBusca.toFixed(2)} ms`);

  if (tempoBusca > 1000) {
    console.warn("Tempo acima de 1000 ms.");
  }

  // TESTE 6 - Preservação do array original
  const copia = await listStudents();

  assert.notEqual(copia, MOCK_STUDENTS);

  // Remove um elemento apenas da cópia
  copia.pop();

  assert.equal(copia.length, 14);
  assert.equal(MOCK_STUDENTS.length, 15);

  console.log("\n[OK] Preservação do array original");

  // TESTE 7 - Verificação dos três status
  assert.ok(MOCK_STUDENTS.some((student) => student.status === "active"));

  assert.ok(MOCK_STUDENTS.some((student) => student.status === "inactive"));

  assert.ok(MOCK_STUDENTS.some((student) => student.status === "transferred"));

  console.log("\n[OK] Todos os status estão presentes");

  // TESTE 8 - Verificação de IDs e matrículas duplicadas
  const ids = MOCK_STUDENTS.map((student) => student.id);

  const matriculas = MOCK_STUDENTS.map((student) => student.registration);

  assert.equal(new Set(ids).size, MOCK_STUDENTS.length);

  assert.equal(new Set(matriculas).size, MOCK_STUDENTS.length);

  console.log("\n[OK] Nenhum ID ou matrícula duplicada");

  // TESTE 9 - Validação dos UUIDs e das datas
  const formatoUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  const formatoData = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

  for (const student of MOCK_STUDENTS) {
    assert.ok(formatoUUID.test(student.id));

    const datas = [student.birthDate, student.createdAt, student.updatedAt];

    for (const data of datas) {
      assert.ok(formatoData.test(data));
      assert.ok(Number.isFinite(Date.parse(data)));
    }
  }

  console.log("\n[OK] UUIDs e datas válidos");

  // TESTE 10 - Independência dos objetos retornados

  const lista = await listStudents();

  // Verifica se os objetos possuem os mesmos valores
  assert.deepEqual(lista, MOCK_STUDENTS);

  // Verifica se cada estudante é um objeto independente
  for (let i = 0; i < lista.length; i++) {
    assert.notStrictEqual(lista[i], MOCK_STUDENTS[i]);
  }

  // Busca individual de um estudante
  const estudanteIndividual = await getStudent(MOCK_STUDENTS[0].id);

  // Verifica se os dados são iguais
  assert.deepEqual(estudanteIndividual, MOCK_STUDENTS[0]);

  // Verifica se as referências são diferentes
  assert.notStrictEqual(estudanteIndividual, MOCK_STUDENTS[0]);

  console.log("\n[OK] Independência dos objetos retornados");

  // Mensagem exibida caso nenhuma verificação falhe
  console.log("\nTodos os testes foram concluídos com sucesso!");
}

// Executa a função e trata possíveis falhas
executarTestes().catch((erro) => {
  console.error("\nFalha durante os testes:", erro);
  process.exitCode = 1;
});
