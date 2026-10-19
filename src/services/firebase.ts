import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  orderBy,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { BNCCSkill } from '../types/game';

// Initialize Firebase App & Firestore Database Instance
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export interface FirebaseClassroom {
  id: string;
  name: string;
  schoolName?: string;
  teacherName?: string;
  createdAt: string;
}

export interface FirebaseStudentPerformance {
  studentId: string;
  studentName: string;
  classroomId: string;
  score: number;
  starsEarned: number;
  levelNumber: number;
  levelTitle: string;
  badgesCount: number;
  ef15lp03_correct: number;
  ef15lp03_attempted: number;
  ef35lp03_correct: number;
  ef35lp03_attempted: number;
  ef35lp04_correct: number;
  ef35lp04_attempted: number;
  ef05lp03_correct: number;
  ef05lp03_attempted: number;
  updatedAt: string;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot as specified in the skill
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is running in offline mode.');
      return false;
    }
    return true;
  }
}

// Pre-seeded classrooms for 3º Ano (A ao E) and 5º Ano (A ao E)
export const INITIAL_CLASSROOMS: FirebaseClassroom[] = [
  // 3º Ano (A ao E)
  {
    id: 'turma-3a',
    name: '3º Ano A',
    schoolName: 'Escola Municipal Monteiro Lobato',
    teacherName: 'Prof.ª Helena Silveira',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'turma-3b',
    name: '3º Ano B',
    schoolName: 'Escola Municipal Monteiro Lobato',
    teacherName: 'Prof. Marcos Vinícius',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'turma-3c',
    name: '3º Ano C',
    schoolName: 'Escola Municipal Monteiro Lobato',
    teacherName: 'Prof.ª Camila Duarte',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'turma-3d',
    name: '3º Ano D',
    schoolName: 'Colégio Cecília Meireles',
    teacherName: 'Prof.ª Juliana Costa',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'turma-3e',
    name: '3º Ano E',
    schoolName: 'Colégio Cecília Meireles',
    teacherName: 'Prof. Roberto Dias',
    createdAt: new Date().toISOString(),
  },

  // 5º Ano (A ao E)
  {
    id: 'turma-5a',
    name: '5º Ano A',
    schoolName: 'Escola Municipal Monteiro Lobato',
    teacherName: 'Prof.ª Fernanda Souza',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'turma-5b',
    name: '5º Ano B',
    schoolName: 'Escola Municipal Monteiro Lobato',
    teacherName: 'Prof. Carlos Eduardo',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'turma-5c',
    name: '5º Ano C',
    schoolName: 'Escola Municipal Monteiro Lobato',
    teacherName: 'Prof.ª Mariana Rios',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'turma-5d',
    name: '5º Ano D',
    schoolName: 'Colégio Cecília Meireles',
    teacherName: 'Prof. Paulo Ricardo',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'turma-5e',
    name: '5º Ano E',
    schoolName: 'Colégio Cecília Meireles',
    teacherName: 'Prof.ª Aline Mendes',
    createdAt: new Date().toISOString(),
  },

  // 4º Ano (A ao E)
  {
    id: 'turma-4a',
    name: '4º Ano A',
    schoolName: 'Escola Municipal Monteiro Lobato',
    teacherName: 'Prof.ª Patrícia Ramos',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'turma-4b',
    name: '4º Ano B',
    schoolName: 'Escola Municipal Monteiro Lobato',
    teacherName: 'Prof. André Martins',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'turma-4c',
    name: '4º Ano C',
    schoolName: 'Colégio Estadual Cecília Meireles',
    teacherName: 'Prof.ª Mariana Rios',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'turma-4d',
    name: '4º Ano D',
    schoolName: 'Colégio Estadual Cecília Meireles',
    teacherName: 'Prof. Thiago Neves',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'turma-4e',
    name: '4º Ano E',
    schoolName: 'Colégio Estadual Cecília Meireles',
    teacherName: 'Prof.ª Renata Lima',
    createdAt: new Date().toISOString(),
  },
];

// Initial mock students for demo when a class is fresh
const SAMPLE_STUDENTS_PER_CLASS: Record<string, FirebaseStudentPerformance[]> = {
  'turma-3a': [
    {
      studentId: 'aluno_ana_beatriz',
      studentName: 'Ana Beatriz Souza',
      classroomId: 'turma-3a',
      score: 520,
      starsEarned: 26,
      levelNumber: 4,
      levelTitle: 'Mestre das Palavras',
      badgesCount: 5,
      ef15lp03_correct: 9,
      ef15lp03_attempted: 10,
      ef35lp03_correct: 8,
      ef35lp03_attempted: 9,
      ef35lp04_correct: 7,
      ef35lp04_attempted: 8,
      ef05lp03_correct: 6,
      ef05lp03_attempted: 7,
      updatedAt: new Date().toISOString(),
    },
    {
      studentId: 'aluno_lucas_silveira',
      studentName: 'Lucas Silveira',
      classroomId: 'turma-3a',
      score: 390,
      starsEarned: 19,
      levelNumber: 3,
      levelTitle: 'Sábio dos Textos',
      badgesCount: 4,
      ef15lp03_correct: 7,
      ef15lp03_attempted: 8,
      ef35lp03_correct: 6,
      ef35lp03_attempted: 8,
      ef35lp04_correct: 5,
      ef35lp04_attempted: 7,
      ef05lp03_correct: 4,
      ef05lp03_attempted: 6,
      updatedAt: new Date().toISOString(),
    },
    {
      studentId: 'aluno_mariana_rocha',
      studentName: 'Mariana Rocha',
      classroomId: 'turma-3a',
      score: 310,
      starsEarned: 15,
      levelNumber: 2,
      levelTitle: 'Desbravador Verbal',
      badgesCount: 3,
      ef15lp03_correct: 6,
      ef15lp03_attempted: 8,
      ef35lp03_correct: 5,
      ef35lp03_attempted: 7,
      ef35lp04_correct: 4,
      ef35lp04_attempted: 6,
      ef05lp03_correct: 3,
      ef05lp03_attempted: 5,
      updatedAt: new Date().toISOString(),
    },
  ],
  'turma-5a': [
    {
      studentId: 'aluno_thiago_ferreira',
      studentName: 'Thiago Ferreira',
      classroomId: 'turma-5a',
      score: 640,
      starsEarned: 32,
      levelNumber: 5,
      levelTitle: 'Guardião do Saber',
      badgesCount: 6,
      ef15lp03_correct: 10,
      ef15lp03_attempted: 10,
      ef35lp03_correct: 10,
      ef35lp03_attempted: 10,
      ef35lp04_correct: 9,
      ef35lp04_attempted: 10,
      ef05lp03_correct: 8,
      ef05lp03_attempted: 9,
      updatedAt: new Date().toISOString(),
    },
    {
      studentId: 'aluno_isabela_prado',
      studentName: 'Isabela Prado',
      classroomId: 'turma-5a',
      score: 470,
      starsEarned: 23,
      levelNumber: 4,
      levelTitle: 'Mestre das Palavras',
      badgesCount: 4,
      ef15lp03_correct: 8,
      ef15lp03_attempted: 9,
      ef35lp03_correct: 8,
      ef35lp03_attempted: 9,
      ef35lp04_correct: 7,
      ef35lp04_attempted: 8,
      ef05lp03_correct: 6,
      ef05lp03_attempted: 8,
      updatedAt: new Date().toISOString(),
    },
  ],
  'turma-4a': [
    {
      studentId: 'aluno_gabriel_mendes',
      studentName: 'Gabriel Mendes',
      classroomId: 'turma-4a',
      score: 580,
      starsEarned: 29,
      levelNumber: 4,
      levelTitle: 'Mestre das Palavras',
      badgesCount: 5,
      ef15lp03_correct: 9,
      ef15lp03_attempted: 10,
      ef35lp03_correct: 9,
      ef35lp03_attempted: 10,
      ef35lp04_correct: 8,
      ef35lp04_attempted: 9,
      ef05lp03_correct: 7,
      ef05lp03_attempted: 8,
      updatedAt: new Date().toISOString(),
    },
    {
      studentId: 'aluno_larissa_duarte',
      studentName: 'Larissa Duarte',
      classroomId: 'turma-4a',
      score: 490,
      starsEarned: 24,
      levelNumber: 3,
      levelTitle: 'Sábio dos Textos',
      badgesCount: 4,
      ef15lp03_correct: 8,
      ef15lp03_attempted: 9,
      ef35lp03_correct: 8,
      ef35lp03_attempted: 9,
      ef35lp04_correct: 7,
      ef35lp04_attempted: 8,
      ef05lp03_correct: 6,
      ef05lp03_attempted: 8,
      updatedAt: new Date().toISOString(),
    },
    {
      studentId: 'aluno_matheus_nunes',
      studentName: 'Matheus Nunes',
      classroomId: 'turma-4a',
      score: 420,
      starsEarned: 21,
      levelNumber: 3,
      levelTitle: 'Sábio dos Textos',
      badgesCount: 4,
      ef15lp03_correct: 7,
      ef15lp03_attempted: 9,
      ef35lp03_correct: 7,
      ef35lp03_attempted: 8,
      ef35lp04_correct: 6,
      ef35lp04_attempted: 8,
      ef05lp03_correct: 5,
      ef05lp03_attempted: 7,
      updatedAt: new Date().toISOString(),
    },
    {
      studentId: 'aluno_beatriz_lima',
      studentName: 'Beatriz Lima',
      classroomId: 'turma-4a',
      score: 360,
      starsEarned: 18,
      levelNumber: 2,
      levelTitle: 'Desbravador Verbal',
      badgesCount: 3,
      ef15lp03_correct: 6,
      ef15lp03_attempted: 8,
      ef35lp03_correct: 6,
      ef35lp03_attempted: 8,
      ef35lp04_correct: 5,
      ef35lp04_attempted: 7,
      ef05lp03_correct: 4,
      ef05lp03_attempted: 6,
      updatedAt: new Date().toISOString(),
    },
    {
      studentId: 'aluno_lucas_teixeira',
      studentName: 'Lucas Teixeira',
      classroomId: 'turma-4a',
      score: 290,
      starsEarned: 14,
      levelNumber: 2,
      levelTitle: 'Desbravador Verbal',
      badgesCount: 2,
      ef15lp03_correct: 5,
      ef15lp03_attempted: 7,
      ef35lp03_correct: 5,
      ef35lp03_attempted: 7,
      ef35lp04_correct: 4,
      ef35lp04_attempted: 6,
      ef05lp03_correct: 3,
      ef05lp03_attempted: 5,
      updatedAt: new Date().toISOString(),
    },
  ],
};

// Seed initial classrooms if empty, and ensure 3º and 5º Ano A-E exist
export async function seedClassroomsIfEmpty(): Promise<FirebaseClassroom[]> {
  const path = 'classrooms';
  try {
    const snap = await getDocs(collection(db, path));
    const existing = snap.docs.map(d => d.data() as FirebaseClassroom);
    const existingIds = new Set(existing.map(c => c.id));

    for (const c of INITIAL_CLASSROOMS) {
      if (!existingIds.has(c.id)) {
        await setDoc(doc(db, path, c.id), c);
        existing.push(c);
      }
    }
    return existing;
  } catch (error) {
    console.error('Error fetching/seeding classrooms:', error);
    return INITIAL_CLASSROOMS;
  }
}

// Fetch all classrooms, ensuring 3º and 5º Ano (A ao E) exist
export async function fetchClassrooms(): Promise<FirebaseClassroom[]> {
  const path = 'classrooms';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return await seedClassroomsIfEmpty();
    }
    const existing = snap.docs.map(d => d.data() as FirebaseClassroom);
    const existingIds = new Set(existing.map(c => c.id));

    // Check if standard 3º or 5º year classes are missing and upsert them
    let missingFound = false;
    for (const c of INITIAL_CLASSROOMS) {
      if (!existingIds.has(c.id)) {
        missingFound = true;
        setDoc(doc(db, path, c.id), c).catch(err =>
          console.warn('Could not auto-seed missing class:', c.id, err)
        );
        existing.push(c);
      }
    }

    // Sort logically: 3º Ano A-E, 4º Ano A-E, 5º Ano A-E, then others
    return existing.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { numeric: true }));
  } catch (error) {
    console.warn('Could not fetch from remote Firestore, using local defaults:', error);
    return INITIAL_CLASSROOMS;
  }
}

// Create a new classroom
export async function createClassroom(
  name: string,
  schoolName: string = 'Escola Municipal',
  teacherName: string = 'Educador Responsável'
): Promise<FirebaseClassroom> {
  const cleanId = 'turma-' + Math.random().toString(36).substring(2, 9);
  const newClass: FirebaseClassroom = {
    id: cleanId,
    name: name.trim(),
    schoolName: schoolName.trim(),
    teacherName: teacherName.trim(),
    createdAt: new Date().toISOString(),
  };

  const path = `classrooms/${cleanId}`;
  try {
    await setDoc(doc(db, 'classrooms', cleanId), newClass);
    return newClass;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Fetch all students in a classroom
export async function fetchStudentsInClassroom(classroomId: string): Promise<FirebaseStudentPerformance[]> {
  const path = `classrooms/${classroomId}/students`;
  try {
    const snap = await getDocs(collection(db, 'classrooms', classroomId, 'students'));
    if (snap.empty && SAMPLE_STUDENTS_PER_CLASS[classroomId]) {
      const samples = SAMPLE_STUDENTS_PER_CLASS[classroomId];
      for (const s of samples) {
        setDoc(doc(db, 'classrooms', classroomId, 'students', s.studentId), s).catch(e =>
          console.warn('Could not seed sample student:', e)
        );
      }
      return samples;
    }
    return snap.docs.map(d => d.data() as FirebaseStudentPerformance);
  } catch (error) {
    if (SAMPLE_STUDENTS_PER_CLASS[classroomId]) {
      return SAMPLE_STUDENTS_PER_CLASS[classroomId];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// Save or sync student performance in Firestore
export async function syncStudentPerformanceToFirebase(
  classroomId: string,
  studentId: string,
  studentName: string,
  score: number,
  starsEarned: number,
  levelNumber: number,
  levelTitle: string,
  badgesCount: number,
  skillStats: Record<BNCCSkill, { attempted: number; correct: number }>
): Promise<FirebaseStudentPerformance> {
  const cleanStudentId = studentId.replace(/[^a-zA-Z0-9_\-]/g, '_') || 'aluno_' + Math.random().toString(36).substring(2, 8);
  const cleanClassroomId = classroomId.replace(/[^a-zA-Z0-9_\-]/g, '_') || 'turma-4a';

  const data: FirebaseStudentPerformance = {
    studentId: cleanStudentId,
    studentName: studentName.trim() || 'Estudante Anônimo',
    classroomId: cleanClassroomId,
    score,
    starsEarned,
    levelNumber,
    levelTitle,
    badgesCount,
    ef15lp03_correct: skillStats.EF15LP03?.correct || 0,
    ef15lp03_attempted: skillStats.EF15LP03?.attempted || 0,
    ef35lp03_correct: skillStats.EF35LP03?.correct || 0,
    ef35lp03_attempted: skillStats.EF35LP03?.attempted || 0,
    ef35lp04_correct: skillStats.EF35LP04?.correct || 0,
    ef35lp04_attempted: skillStats.EF35LP04?.attempted || 0,
    ef05lp03_correct: skillStats.EF05LP03?.correct || 0,
    ef05lp03_attempted: skillStats.EF05LP03?.attempted || 0,
    updatedAt: new Date().toISOString(),
  };

  const path = `classrooms/${cleanClassroomId}/students/${cleanStudentId}`;
  try {
    await setDoc(doc(db, 'classrooms', cleanClassroomId, 'students', cleanStudentId), data, { merge: true });
    return data;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
