# ClinicaApp — Frontend Vue.js

Interface web do sistema de gerenciamento de clínica médica, desenvolvida com Vue 3. Consome a API REST do backend Django.

## Tecnologias

- **Vue 3** com Composition API
- **Vue Router 5** para navegação entre telas
- **Axios** para comunicação com a API REST
- **Vite** como bundler e servidor de desenvolvimento
- **Lucide Vue Next** para ícones

## Pré-requisitos

- Node.js 20+
- Backend Django rodando em `http://localhost:8000`

## Instalação e execução

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173` no navegador.

## Scripts

```bash
npm run dev      # servidor de desenvolvimento
npm run build    # gera build de produção na pasta dist/
npm run preview  # visualiza o build localmente
```

## Módulos

| Módulo | Descrição |
|---|---|
| Consultas | Agendamento e registro de consultas médicas |
| Exames | Solicitação e acompanhamento de exames |
| Receitas | Emissão de receitas com múltiplos medicamentos |
| Pacientes | Cadastro e histórico de pacientes |
| Médicos | Cadastro de médicos |
| CIDs | Cadastro de códigos CID-10 |
| Medicamentos | Cadastro de medicamentos |
| Históricos | Histórico médico dos pacientes |

## Integrantes

- Milena Alves de Lima
- Lucas Veras Amui