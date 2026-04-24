import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config'; 

// URL do banco 
const connectionString = process.env.DATABASE_URL;

// Pool e o Adapter do Postgres
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      nome: 'admin',
      email: 'admin@admin.com',
      senha: '$2b$10$xC.oCwoOO6sP7JJ/dukd8OpbQjscmnrAgfeReD7swDf5GOS42HIbm', /* #123123 */
    },
  });

  console.log(`Usuário garantido com sucesso: ${admin.email}`);

  // Limpa as trilhas antigas do usuario
  await prisma.trilha.deleteMany({
    where: { usuarioId: admin.id }
  });

  // Trilhas e seus respectivos conteúdos
  const trilhasIniciais = [
    {
      titulo: "Estudos de Frontend",
      descricao: "React Native, Vue e UX Design",
      icone: "code",
      usuarioId: admin.id,
      conteudos: {
        create: [
          { titulo: "Entendendo o React Navigation", url: "https://youtube.com/watch?v=exemplo1", tipo: "video", isCompleted: true },
          { titulo: "Hooks: useState e useEffect", url: "https://reactnative.dev/docs", tipo: "artigo", isCompleted: false },
          { titulo: "Boas práticas de UX Mobile", url: "https://medium.com/ux", tipo: "artigo", isCompleted: false },
        ],
      },
    },
    {
      titulo: "Dominando o Backend",
      descricao: "Node.js, NestJS e APIs RESTful",
      icone: "server", 
      usuarioId: admin.id,
      conteudos: {
        create: [
          { titulo: "O que é Injeção de Dependência?", url: "https://youtube.com/watch?v=exemplo2", tipo: "video", isCompleted: true },
          { titulo: "Criando CRUD com NestJS", url: "https://docs.nestjs.com", tipo: "curso", isCompleted: true },
          { titulo: "Tratamento de Exceções HTTP", url: "https://dev.to/nestjs", tipo: "artigo", isCompleted: false },
        ],
      },
    },
    {
      titulo: "Banco de Dados",
      descricao: "PostgreSQL, Prisma ORM e Modelagem",
      icone: "database",
      usuarioId: admin.id,
      conteudos: {
        create: [
          { titulo: "Introdução ao Prisma ORM", url: "https://youtube.com/watch?v=exemplo3", tipo: "video", isCompleted: false },
          { titulo: "Relacionamentos 1:N e N:N", url: "https://prisma.io/docs", tipo: "artigo", isCompleted: false },
        ],
      },
    },
    {
      titulo: "DevOps & Deploy",
      descricao: "Docker, CI/CD e Nuvem",
      icone: "cloud",
      usuarioId: admin.id,
      conteudos: {
        create: [
          { titulo: "Docker para Desenvolvedores", url: "https://youtube.com/watch?v=exemplo4", tipo: "curso", isCompleted: false },
        ],
      },
    }
  ];

  console.log('Inserindo trilhas e conteúdos...');
  
  for (const trilha of trilhasIniciais) {
    await prisma.trilha.create({
      data: trilha
    });
  }

  console.log('Seed executado com sucesso! 🎉 Banco populado com 4 trilhas.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });