import type { MarkerColumn, MarkerEntity } from '../../schema'

/**
 * O painel imuno das cinco neoplasias B de células pequenas que competem entre si
 * no linfonodo. Um dado errado aqui é um dado errado no site inteiro — é este o
 * arquivo a corrigir, e nenhum outro.
 */

export const columns: MarkerColumn[] = [
  {
    id: 'cd5',
    label: 'CD5',
    depth: {
      glance: 'CD5',
      probe: 'Numa população B monoclonal, o que a positividade para CD5 significa?',
      brief:
        'Antígeno de célula T. Expresso por uma população B monoclonal, é aberrante — e parte o diferencial em dois compartimentos.',
      detail: [
        {
          kind: 'rule',
          body: 'CD5 divide; CD23, ciclina D1 e CD200 decidem dentro da metade CD5-positiva.',
        },
        {
          kind: 'pitfall',
          body: 'A intensidade importa e o controle interno é obrigatório: as células T do próprio corte marcam mais forte que as B neoplásicas. Ler "positivo" sem comparar com elas superestima o CD5.',
        },
        {
          kind: 'pitfall',
          body: 'Uma minoria de linfomas de zona marginal e linfoplasmocíticos expressa CD5 fraco. CD5 positivo não obriga a fechar em LLC/SLL ou manto.',
        },
      ],
    },
  },
  {
    id: 'cd23',
    label: 'CD23',
    depth: {
      glance: 'CD23',
      probe: 'Você tem uma população B CD5+. O que CD23 resolve aí?',
      brief: 'Separa LLC/SLL de linfoma de células do manto dentro do compartimento CD5-positivo.',
      detail: [
        {
          kind: 'pitfall',
          body: 'A rede de células dendríticas foliculares é CD23-positiva. No linfoma folicular ela desenha uma malha vistosa que não é expressão das células neoplásicas — avalie a membrana das células, não o retículo.',
        },
        {
          kind: 'text',
          body: 'Parte dos linfomas de células do manto mostra CD23 fraco ou em subgrupo de células. Isoladamente, CD23 nunca fecha o diagnóstico.',
        },
      ],
    },
  },
  {
    id: 'cd10',
    label: 'CD10',
    depth: {
      glance: 'CD10',
      brief: 'Marca origem em centro germinativo. Junto de BCL6, aponta para linfoma folicular.',
      detail: [
        {
          kind: 'pitfall',
          body: 'A expressão costuma ser mais forte dentro dos folículos neoplásicos que no componente interfolicular ou difuso. Amostra só de área difusa pode sair CD10-negativa num folicular legítimo.',
        },
      ],
    },
  },
  {
    id: 'bcl6',
    label: 'BCL6',
    depth: {
      glance: 'BCL6',
      brief: 'Marcador nuclear de centro germinativo. Acompanha o CD10 e sustenta a leitura quando ele falha.',
    },
  },
  {
    id: 'cd43',
    label: 'CD43',
    depth: {
      glance: 'CD43',
      brief:
        'Co-expressão aberrante numa população B. Reforça monoclonalidade, mas não distingue entre as entidades CD5-positivas.',
      detail: [
        {
          kind: 'rule',
          body: 'Útil para dizer "neoplásico" quando a dúvida é contra hiperplasia; inútil para dizer qual neoplasia.',
        },
      ],
    },
  },
  {
    id: 'ciclina-d1',
    label: 'Ciclina D1',
    depth: {
      glance: 'Ciclina D1',
      probe: 'Ciclina D1 nuclear numa proliferação B de células pequenas — qual a leitura imediata?',
      brief: 'Positividade nuclear traduz a t(11;14) e define o linfoma de células do manto.',
      detail: [
        {
          kind: 'pitfall',
          body: 'Só conta marcação nuclear das células neoplásicas. Endotélio, macrófagos e histiócitos são positivos de rotina e servem de controle interno — não de resultado.',
        },
        {
          kind: 'pitfall',
          body: 'Existe manto ciclina D1-negativo, com rearranjo de CCND2 ou CCND3. É onde o SOX11 salva o caso.',
        },
      ],
    },
  },
  {
    id: 'sox11',
    label: 'SOX11',
    depth: {
      glance: 'SOX11',
      brief:
        'Marcador nuclear que continua positivo no manto ciclina D1-negativo — a única forma prática de não perder essa variante.',
      detail: [
        {
          kind: 'rule',
          body: 'Suspeita clínica e morfológica de manto com ciclina D1 negativa: peça SOX11 antes de fechar em zona marginal.',
        },
      ],
    },
  },
  {
    id: 'lef1',
    label: 'LEF1',
    depth: {
      glance: 'LEF1',
      brief:
        'Marcação nuclear praticamente restrita à LLC/SLL entre as neoplasias B de células pequenas.',
      detail: [
        {
          kind: 'text',
          body: 'As células T são LEF1-positivas de forma fisiológica e servem de controle interno; o achado relevante é a positividade nuclear na população B.',
        },
      ],
    },
  },
  {
    id: 'cd200',
    label: 'CD200',
    depth: {
      glance: 'CD200',
      probe: 'CD5+ e ciclina D1 duvidosa. Qual marcador desempata LLC/SLL contra manto?',
      brief:
        'Forte na LLC/SLL, negativo no manto. É o par do CD23 quando a ciclina D1 sai equívoca.',
      detail: [
        {
          kind: 'rule',
          body: 'No compartimento CD5-positivo, CD200 e CD23 andam juntos: positivos apontam LLC/SLL, negativos apontam manto.',
        },
      ],
    },
  },
  {
    id: 'bcl2',
    label: 'BCL2',
    depth: {
      glance: 'BCL2',
      brief:
        'Positivo em todas as cinco — por isso não realça como coluna decisiva. Ele não está aqui para separá-las.',
      detail: [
        {
          kind: 'rule',
          body: 'O papel do BCL2 é outro: folículos BCL2-positivos separam linfoma folicular de hiperplasia folicular reativa, cujos centros germinativos são negativos.',
        },
        {
          kind: 'pitfall',
          body: 'Foliculares de alto grau e o tipo pediátrico podem ser BCL2-negativos. Negatividade não exclui folicular.',
        },
      ],
    },
  },
]

export const entities: MarkerEntity[] = [
  {
    id: 'llc',
    short: 'LLC/SLL',
    name: 'Leucemia linfocítica crônica / linfoma linfocítico',
    depth: {
      glance: 'LLC / linfoma linfocítico de pequenas células',
      probe: 'Qual achado arquitetural é quase exclusivo desta entidade no linfonodo?',
      brief:
        'Apagamento difuso do linfonodo por linfócitos pequenos, pontuado por centros de proliferação pálidos — o achado que praticamente sela o diagnóstico à baixa magnificação.',
      detail: [
        {
          kind: 'list',
          title: 'Assinatura imuno',
          items: [
            'CD5 e CD23 positivos, com CD200 forte e LEF1 nuclear',
            'Ciclina D1 e SOX11 negativos',
            'Imunoglobulina de superfície caracteristicamente fraca',
          ],
        },
        {
          kind: 'rule',
          body: 'Centros de proliferação + CD5/CD23/CD200/LEF1 positivos: o diagnóstico se fecha sem molecular.',
        },
        {
          kind: 'pitfall',
          body: 'Centros de proliferação expandidos, com atividade mitótica alta ou lençóis de células grandes, exigem excluir transformação — a avaliação é do tamanho e da confluência das áreas pálidas, não só da imuno.',
        },
      ],
    },
    results: {
      cd5: 'pos',
      cd23: 'pos',
      cd10: 'neg',
      bcl6: 'neg',
      cd43: 'pos',
      'ciclina-d1': 'neg',
      sox11: 'neg',
      lef1: 'pos',
      cd200: 'pos',
      bcl2: 'pos',
    },
    notes: {
      lef1: 'Positividade nuclear na população B. Entre as neoplasias B de células pequenas, é praticamente exclusiva da LLC/SLL.',
      cd200: 'Expressão forte. Contra o manto, que é negativo, é o desempate mais confiável depois da ciclina D1.',
      cd23: 'Positivo em conjunto com CD5 — a combinação clássica que separa da célula do manto.',
    },
  },
  {
    id: 'lcm',
    short: 'LCM',
    name: 'Linfoma de células do manto',
    depth: {
      glance: 'Linfoma de células do manto',
      probe: 'CD5+ e CD23−. O que confirma, e o que fazer se a ciclina D1 vier negativa?',
      brief:
        'Proliferação monótona de células pequenas a médias de contorno irregular, definida pela t(11;14) e pela expressão nuclear de ciclina D1.',
      detail: [
        {
          kind: 'list',
          title: 'Assinatura imuno',
          items: [
            'CD5 positivo com CD23 e CD200 negativos',
            'Ciclina D1 e SOX11 nucleares positivos',
            'LEF1 negativo',
          ],
        },
        {
          kind: 'rule',
          body: 'Ciclina D1 negativa com morfologia e clínica sugestivas não encerra o caso: SOX11 identifica a variante com rearranjo de CCND2 ou CCND3.',
        },
        {
          kind: 'pitfall',
          body: 'É a entidade que mais custa caro perder: o comportamento clínico difere de tudo que se parece com ela na lâmina. Diante de qualquer proliferação B CD5-positiva, ciclina D1 é obrigatória.',
        },
      ],
    },
    results: {
      cd5: 'pos',
      cd23: 'neg',
      cd10: 'neg',
      bcl6: 'neg',
      cd43: 'pos',
      'ciclina-d1': 'pos',
      sox11: 'pos',
      lef1: 'neg',
      cd200: 'neg',
      bcl2: 'pos',
    },
    notes: {
      'ciclina-d1': 'Marcação nuclear das células neoplásicas. Endotélio e histiócitos positivos são controle interno, não resultado.',
      sox11: 'Permanece positivo na variante ciclina D1-negativa — é o que impede o caso de ser rotulado como zona marginal.',
      cd200: 'Negativo. Junto do CD23 negativo, é o contraste que afasta a LLC/SLL.',
    },
  },
  {
    id: 'lf',
    short: 'LF',
    name: 'Linfoma folicular',
    depth: {
      glance: 'Linfoma folicular',
      probe: 'Folículos por todo o linfonodo: o que separa isso de hiperplasia folicular reativa?',
      brief:
        'Folículos neoplásicos confluentes, de tamanho monótono e sem zona de manto definida, com fenótipo de centro germinativo e BCL2 positivo.',
      detail: [
        {
          kind: 'list',
          title: 'Contra hiperplasia folicular reativa',
          items: [
            'Folículos monótonos, dorso a dorso, ocupando também a região medular',
            'Perda da polarização do centro germinativo e ausência de macrófagos de corpos tingíveis',
            'BCL2 positivo nos folículos — os centros germinativos reativos são negativos',
          ],
        },
        {
          kind: 'pitfall',
          body: 'BCL2 negativo não exclui: foliculares de alto grau e o tipo pediátrico costumam ser negativos. Nesses casos a arquitetura e o CD10/BCL6 sustentam o diagnóstico.',
        },
      ],
    },
    results: {
      cd5: 'neg',
      cd23: 'neg',
      cd10: 'pos',
      bcl6: 'pos',
      cd43: 'neg',
      'ciclina-d1': 'neg',
      sox11: 'neg',
      lef1: 'neg',
      cd200: 'neg',
      bcl2: 'pos',
    },
    notes: {
      cd10: 'Mais forte dentro dos folículos neoplásicos que na área interfolicular — amostra só de zona difusa pode sair falsamente negativa.',
      bcl2: 'Positivo nos folículos neoplásicos. É o contraste com o centro germinativo reativo, que é negativo.',
      cd23: 'As células tumorais são negativas; a malha de células dendríticas foliculares é positiva e não deve ser lida como expressão do tumor.',
    },
  },
  {
    id: 'lzm',
    short: 'LZM',
    name: 'Linfoma de zona marginal',
    depth: {
      glance: 'Linfoma de zona marginal',
      probe: 'Por que esta entidade é a mais arriscada de diagnosticar por imuno?',
      brief:
        'Células B monocitoides expandindo a zona marginal em torno de folículos residuais. Não tem marcador próprio — é diagnóstico por exclusão.',
      detail: [
        {
          kind: 'rule',
          body: 'Só se chega aqui depois de excluir positivamente as outras quatro. Um painel negativo não é o diagnóstico: é o pré-requisito dele.',
        },
        {
          kind: 'list',
          title: 'O que sustenta o diagnóstico',
          items: [
            'Padrão de zona marginal com colonização de folículos residuais',
            'Citologia monocitoide, com diferenciação plasmocitária variável',
            'Monoclonalidade demonstrada por cadeias leves ou por rearranjo de IGH',
          ],
        },
        {
          kind: 'pitfall',
          body: 'É onde o manto ciclina D1-negativo se esconde. Antes de fechar por exclusão, o SOX11 precisa estar negativo.',
        },
      ],
    },
    results: {
      cd5: 'neg',
      cd23: 'neg',
      cd10: 'neg',
      bcl6: 'neg',
      cd43: 'subset',
      'ciclina-d1': 'neg',
      sox11: 'neg',
      lef1: 'neg',
      cd200: 'variable',
      bcl2: 'pos',
    },
    notes: {
      sox11: 'Precisa estar negativo. É a checagem que separa uma zona marginal legítima de um manto ciclina D1-negativo.',
      cd43: 'Positivo em parte dos casos. Quando presente, ajuda a afastar hiperplasia — quando ausente, não afasta nada.',
    },
  },
  {
    id: 'llp',
    short: 'LLP',
    name: 'Linfoma linfoplasmocítico',
    depth: {
      glance: 'Linfoma linfoplasmocítico',
      brief:
        'Infiltrado de linfócitos pequenos, linfoplasmócitos e plasmócitos, tipicamente com IgM sérica monoclonal e mutação MYD88 L265P.',
      detail: [
        {
          kind: 'list',
          title: 'O que sustenta o diagnóstico',
          items: [
            'Espectro maturativo contínuo: linfócito → linfoplasmócito → plasmócito',
            'MYD88 L265P presente na grande maioria dos casos',
            'Correlação obrigatória com a IgM monoclonal do soro',
          ],
        },
        {
          kind: 'pitfall',
          body: 'Zona marginal com diferenciação plasmocitária é o diferencial direto e a morfologia não resolve sozinha. MYD88 e o quadro clínico decidem.',
        },
      ],
    },
    results: {
      cd5: 'neg',
      cd23: 'variable',
      cd10: 'neg',
      bcl6: 'neg',
      cd43: 'subset',
      'ciclina-d1': 'neg',
      sox11: 'neg',
      lef1: 'neg',
      cd200: 'pos',
      bcl2: 'pos',
    },
    notes: {
      cd200: 'Positivo, como na LLC/SLL. Aqui a separação não vem do CD200 e sim do CD5, negativo neste caso.',
    },
  },
]
