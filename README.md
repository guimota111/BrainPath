# BrainPath

Site de consulta em patologia onde a informação chega como arte interativa. Em vez de
parágrafos, o leitor encontra diagramas clicáveis e desenrola o texto por camadas.

## As cinco regras

Valem para toda peça do site. São elas que separam infográfico de card com texto.

1. **Nada de parágrafo na primeira tela.** O estado inicial de qualquer peça é geometria, cor e
   rótulos curtos. Texto corrido só existe depois de um clique deliberado.
2. **Profundidade em níveis fixos.** Todo elemento clicável declara `glance` (rótulo) →
   `brief` (uma frase) → `detail` (painel). O comportamento é o mesmo no site inteiro.
3. **Sem moldura.** Nenhum card, nenhuma borda de widget. Cada cena é uma composição, com uma
   cor de acento própria.
4. **Recuperação antes da revelação.** Com o modo treino ligado, todo elemento que declara
   `probe` pergunta antes de contar.
5. **Estado na URL.** Hotspot aberto, camada ativa e filtros viram query params — link que abre
   no ponto exato e botão voltar que desfaz passo a passo.

## Como o conteúdo funciona

Conteúdo é código. Um tema é um arquivo de dados que descreve *o que* é verdade sobre o assunto;
os artifacts em `src/artifacts` decidem *como* aquilo vira arte interativa.

```
src/
  content/
    schema.ts      tipos de Topic, Scene e do sistema de profundidade
    registry.ts    índice dos temas + busca da porta "por achado"
    topics/<slug>/ um diretório por tema
  artifacts/
    marker-matrix/ painel imuno com modo bancada
    hotspot-map/   arte esquemática com regiões clicáveis
    layer-stack/   camadas que se acumulam sobre a mesma arte
    art/           os desenhos SVG, registrados por nome
  ui/              primitivas de revelação compartilhadas
```

### Adicionar um tema

1. Crie `src/content/topics/<slug>/index.ts` exportando um `Topic`.
2. Registre o tema em `src/content/registry.ts`.
3. Preencha `findings` — é o que alimenta a busca por achado morfológico na home.
4. Enquanto não houver revisão de um patologista, mantenha `draft: true`: o site marca isso
   na cara do leitor.

Precisando de uma arte nova, adicione o componente em `src/artifacts/art/` e registre-o em
`art/registry.ts`; o tema passa a referenciá-lo por string.

## Rodar

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm run build    # typecheck + build de produção
npm run lint
```

## Deploy

Todo push no `main` roda lint e build e publica no Firebase Hosting
(`.github/workflows/ci.yml`). Pull requests rodam só lint e build.

O deploy fica em espera até o repositório ter o secret com a credencial — sem ele
o job passa com um aviso, em vez de falhar. Para ligar, uma vez só:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting:github
```

O comando cria a service account, grava o secret
`FIREBASE_SERVICE_ACCOUNT_BRAINPATH123` no GitHub e oferece gerar workflows —
**recuse**, ou apague os que ele criar: o workflow deste repositório já cobre isso.

Para publicar à mão, sem passar pelo GitHub:

```bash
npm run build
firebase deploy --only hosting
```

## Aviso

Material de apoio ao estudo. Não substitui as classificações vigentes nem serve como ferramenta
diagnóstica.
