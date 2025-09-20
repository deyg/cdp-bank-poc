# 🧪 DEMO CDP – BANCO HEXAGONAL DIGITAL POR CDP

## 📖 HISTÓRIA – DEMO CDP: BANCO HEXAGONAL DIGITAL

### 🧠 Por que existe essa demo?

Esta demo foi criada para mostrar na prática como aplicar o processo **CDP – Codex Driven Process** para construir um **Banco Digital com Arquitetura Hexagonal**, usando **JavaScript moderno, Node.js, PostgreSQL, testes automatizados e princípios de clean architecture com closures**.

---

### 🧩 O que ela entrega?

Um sistema completo com:

- Entidade `Conta` funcional (com closure)
- Casos de uso (`depositar`, `sacar`, `transferir`)
- Portas de entrada e saída
- Adapters: PostgreSQL e InMemory
- REST API com Fastify
- Testes unitários com Jest
- README explicativo
- Empacotamento para workshops
- Arquitetura extensível e limpa

---

### 🧭 Como ela é construída?

A aplicação é construída com base em **15 commits intencionais**, cada um guiado por um **prompt específico do CDP**. Isso permite que qualquer desenvolvedor, IA ou time técnico execute a construção de forma incremental, previsível e rastreável.

---

### 🔁 Ciclo por ciclo — O passo a passo

1. Modelamos o domínio como closure com métodos puros: `depositar`, `sacar`, `transferirPara`.
2. Testamos o domínio com Jest para garantir comportamentos corretos.
3. Criamos a porta de saída `ContaRepositoryPort`, que define como o domínio interage com o mundo externo.
4. Criamos a porta de entrada `ContaUseCasePort`, com padrão `execute(input)`.
5. Implementamos casos de uso como classes que injetam o repositório e executam a lógica.
6. Criamos dois adapters: um para PostgreSQL (via `pg` e Docker) e outro em memória.
7. Compondo tudo, usamos Fastify para expor a API REST.
8. Testamos os use cases com repositório fake.
9. Documentamos tudo em um `README.md`.
10. Criamos o pacote `.zip` com todos os artefatos para apresentação, palestras e reuso.

---

### 🚀 O que aprendemos com ela

✅ CDP não é só sobre IA, é sobre **intencionalidade arquitetural**, rastreabilidade e reaproveitamento de conhecimento.  
✅ Você não depende de frameworks mágicos se entende os princípios.  
✅ O Codex, como executor de commits e prompts, acelera a entrega e garante padronização.  
✅ Um projeto pequeno, mas bem arquitetado, serve como pilar didático para milhares.

---

## 🔖 Prompts CDP (ordem dos commits)

01. prompt-01-story-domain-conta.txt
02. prompt-02-test-domain-conta.txt
03. prompt-03-porta-saida-conta-repository.txt
04. prompt-04-porta-entrada-usecase.txt
05. prompt-05-usecase-depositar.txt
06. prompt-06-usecase-sacar.txt
07. prompt-07-usecase-transferir.txt
08. prompt-08-adapter-repository-postgres.txt
09. prompt-09-adapter-repository-memory.txt
10. prompt-10-factory-usecases.txt
11. prompt-11-app-fastify-rest.txt
12. prompt-12-tests-usecases.txt
13. prompt-13-readme-docs.txt
14. prompt-14-banner-manifesto.txt
15. prompt-15-zip-e-pronto-para-palestra.txt