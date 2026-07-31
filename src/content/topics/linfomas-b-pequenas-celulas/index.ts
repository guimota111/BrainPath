import type { Topic } from '../../schema'
import { columns, entities } from './matriz'

export const linfomasBPequenasCelulas: Topic = {
  slug: 'linfomas-b-pequenas-celulas',
  title: 'Neoplasias B de células pequenas',
  subtitle: 'Cinco entidades que competem no mesmo linfonodo, e o que separa uma da outra.',
  area: 'hematopatologia',
  accent: 'series-7',
  findings: [
    'linfócitos pequenos',
    'padrão nodular',
    'apagamento difuso',
    'centros de proliferação',
    'zona marginal expandida',
    'células monocitoides',
    'população B CD5 positiva',
    'ciclina D1',
    'SOX11',
    'linfonodo',
  ],
  sources: [
    {
      label: 'WHO Classification of Haematolymphoid Tumours, 5ª edição',
      detail: 'Critérios das entidades e nomenclatura.',
    },
    {
      label: 'International Consensus Classification (ICC), 2022',
      detail: 'Divergências de nomenclatura em relação à OMS.',
    },
  ],
  reviewedAt: '2026-07-31',
  draft: true,

  scenes: [
    /* ---------------------------------------------------------------- *
     * Cena 1 — o que se vê no aumento pequeno, antes de qualquer imuno.
     * ---------------------------------------------------------------- */
    {
      kind: 'hotspot',
      id: 'padroes',
      title: 'O que a objetiva de 4× já entrega',
      lede: 'Quatro padrões arquiteturais no mesmo linfonodo esquemático.',
      art: 'linfonodo-padroes',
      hotspots: [
        {
          id: 'nodular',
          path: 'M 0 0 H 50 V 50 H 0 Z',
          label: { x: 24, y: 44 },
          suggests: [
            { entityId: 'lf', label: 'Linfoma folicular' },
            { entityId: 'lcm', label: 'Manto, variante nodular' },
          ],
          depth: {
            glance: 'Padrão nodular',
            probe: 'Nódulos por todo o linfonodo. O que precisa ser respondido antes de tudo?',
            brief:
              'Nódulos confluentes de tamanho monótono, sem zona de manto preservada e ocupando também a medular — arquitetura que já separa neoplasia de hiperplasia.',
            detail: [
              {
                kind: 'rule',
                body: 'A primeira pergunta não é qual linfoma, é se os folículos são neoplásicos: BCL2 positivo dentro deles resolve na maioria dos casos.',
              },
              {
                kind: 'pitfall',
                body: 'O manto tem variante nodular e a zona marginal coloniza folículos residuais. Padrão nodular não é sinônimo de linfoma folicular.',
              },
            ],
          },
        },
        {
          id: 'difuso',
          path: 'M 50 0 H 100 V 50 H 50 Z',
          label: { x: 75, y: 24 },
          suggests: [
            { entityId: 'lcm', label: 'Linfoma de células do manto' },
            { entityId: 'llc', label: 'LLC/SLL' },
          ],
          depth: {
            glance: 'Apagamento difuso',
            brief:
              'Arquitetura substituída por lençol monótono de células pequenas, sem folículos residuais reconhecíveis.',
            detail: [
              {
                kind: 'rule',
                body: 'Difuso e monótono, sem áreas pálidas: ciclina D1 é obrigatória antes de qualquer outra coisa.',
              },
              {
                kind: 'text',
                body: 'A monotonia é o dado — populações reativas trazem mistura de tamanhos, centros germinativos e plasmócitos policlonais.',
              },
            ],
          },
        },
        {
          id: 'zona-marginal',
          path: 'M 0 50 H 50 V 100 H 0 Z',
          label: { x: 22, y: 55 },
          suggests: [{ entityId: 'lzm', label: 'Linfoma de zona marginal' }],
          depth: {
            glance: 'Zona marginal expandida',
            probe: 'Halo pálido em volta de folículos residuais — o que precisa ser excluído antes?',
            brief:
              'Halo de células monocitoides, de citoplasma amplo e claro, alargando a zona marginal em torno de folículos que ainda existem.',
            detail: [
              {
                kind: 'pitfall',
                body: 'Expansão da zona marginal também acontece em processos reativos, sobretudo em toxoplasmose e em contexto autoimune. O padrão levanta a hipótese; a monoclonalidade é que a sustenta.',
              },
              {
                kind: 'rule',
                body: 'Antes de fechar por exclusão, ciclina D1 e SOX11 precisam estar negativos.',
              },
            ],
          },
        },
        {
          id: 'centros-proliferacao',
          path: 'M 50 50 H 100 V 100 H 50 Z',
          label: { x: 73, y: 57 },
          suggests: [{ entityId: 'llc', label: 'LLC/SLL' }],
          depth: {
            glance: 'Centros de proliferação',
            probe: 'Manchas pálidas mal delimitadas num fundo difuso. Qual entidade isso anuncia?',
            brief:
              'Áreas pálidas de limites vagos, com prolinfócitos e paraimunoblastos, sobre um fundo difuso de linfócitos pequenos. É o achado quase exclusivo da LLC/SLL.',
            detail: [
              {
                kind: 'rule',
                body: 'Diferente do folículo, o centro de proliferação não tem contorno definido nem zona de manto — ele se dissolve no fundo difuso.',
              },
              {
                kind: 'pitfall',
                body: 'Centros expandidos e confluentes, com alta atividade mitótica, deixam de ser um achado banal: passam a exigir avaliação de transformação.',
              },
            ],
          },
        },
      ],
    },

    /* ---------------------------------------------------------------- *
     * Cena 2 — o painel imuno. O centro do tema.
     * ---------------------------------------------------------------- */
    {
      kind: 'matrix',
      id: 'imuno',
      title: 'O painel, e o que cada marcador ainda decide',
      lede: 'Declare o que viu no microscópio e o diferencial se estreita sozinho.',
      columns,
      entities,
    },

    /* ---------------------------------------------------------------- *
     * Cena 3 — a mesma lâmina, descida nível por nível.
     * ---------------------------------------------------------------- */
    {
      kind: 'layers',
      id: 'caso',
      title: 'Descer no caso',
      lede: 'O mesmo campo, quatro profundidades.',
      art: 'campo-linfoide',
      layers: [
        {
          id: 'arquitetura',
          step: 'Arquitetura',
          depth: {
            glance: 'O padrão antes das células',
            brief:
              'No aumento pequeno decide-se apenas se a arquitetura está preservada, nodular ou apagada — e a resposta já elimina metade do diferencial.',
            detail: [
              {
                kind: 'rule',
                body: 'Nenhuma imuno é pedida antes desta pergunta. O padrão define qual painel vale a pena.',
              },
            ],
          },
          marks: [
            {
              id: 'arq-nodulos',
              x: 30,
              y: 10,
              label: 'nódulos mal definidos',
              note: 'Contornos que não se resolvem em folículo verdadeiro: sem zona de manto, sem polarização. Aponta para centro de proliferação, não para folículo neoplásico.',
            },
            {
              id: 'arq-fundo',
              x: 76,
              y: 62,
              label: 'fundo difuso',
              note: 'Lençol monótono entre os nódulos. A combinação de fundo difuso com áreas pálidas mal delimitadas é a assinatura arquitetural da LLC/SLL.',
            },
          ],
        },
        {
          id: 'citologia',
          step: 'Citologia',
          depth: {
            glance: 'Núcleo a núcleo, no aumento grande',
            probe: 'Que três atributos nucleares você checa antes de pedir qualquer marcador?',
            brief:
              'Contorno, cromatina e nucléolo. Os três juntos direcionam o painel; nenhum deles isolado fecha entidade.',
            detail: [
              {
                kind: 'list',
                title: 'O que cada um sugere',
                items: [
                  'Contorno irregular, clivado, em célula pequena a média: manto',
                  'Cromatina grosseira em blocos, contorno redondo: LLC/SLL',
                  'Citoplasma amplo e claro, núcleo redondo: zona marginal',
                  'Espectro contínuo até plasmócito: linfoplasmocítico',
                ],
              },
              {
                kind: 'pitfall',
                body: 'Artefato de fixação e corte espesso distorcem contorno nuclear. Irregularidade só vale como dado onde o corte está bem fixado e fino.',
              },
            ],
          },
          marks: [
            {
              id: 'cito-cromatina',
              x: 30,
              y: 44,
              label: 'cromatina em blocos',
              note: 'Grumos densos alternando com áreas claras, o aspecto descrito como "em saibro". Característico do linfócito da LLC/SLL.',
            },
            {
              id: 'cito-contorno',
              x: 71,
              y: 51,
              label: 'contorno irregular',
              note: 'Reentrâncias nucleares em célula pequena a média, sem nucléolo evidente. É o dado citológico que puxa o caso para o manto.',
            },
          ],
        },
        {
          id: 'imunofenotipo',
          step: 'Imunofenótipo',
          depth: {
            glance: 'Co-expressão na mesma membrana',
            brief:
              'A pergunta não é quais marcadores aparecem no corte, e sim quais aparecem na mesma célula — CD5 sobre uma população B só significa algo se for a B que o expressa.',
            detail: [
              {
                kind: 'rule',
                body: 'Sem duplo controle interno — as T do próprio corte para o CD5, o endotélio para a ciclina D1 — o painel não é interpretável.',
              },
              {
                kind: 'pitfall',
                body: 'Populações T reativas abundantes num linfoma B simulam CD5 positivo em cortes lidos rápido. Na dúvida, dupla marcação ou citometria.',
              },
            ],
          },
          marks: [
            {
              id: 'imuno-coexp',
              x: 52,
              y: 50,
              label: 'CD20 e CD5 na mesma célula',
              note: 'O anel duplo representa co-expressão de membrana. É esse achado, e não a presença dos dois marcadores no campo, que define uma população B CD5-positiva.',
            },
          ],
        },
        {
          id: 'molecular',
          step: 'Molecular',
          depth: {
            glance: 'Quando a molecular decide',
            brief:
              'Só entra onde morfologia e imuno não fecham — e em duas situações ela decide sozinha: ciclina D1 negativa com suspeita de manto, e diferencial entre linfoplasmocítico e zona marginal.',
            detail: [
              {
                kind: 'list',
                title: 'As alterações que mudam a conduta',
                items: [
                  't(11;14) IGH::CCND1 — define o linfoma de células do manto',
                  't(14;18) IGH::BCL2 — sustenta o linfoma folicular',
                  'MYD88 L265P — presente na grande maioria dos linfoplasmocíticos',
                  'del(17p) e estado mutacional de IGHV — prognóstico e conduta na LLC',
                ],
              },
              {
                kind: 'rule',
                body: 'Pedir molecular antes de esgotar arquitetura e imuno inverte a ordem do raciocínio e encarece o caso sem resolvê-lo.',
              },
            ],
          },
          marks: [
            {
              id: 'mol-t1114',
              x: 50,
              y: 32,
              label: 't(11;14) IGH::CCND1',
              note: 'A troca recíproca põe CCND1 sob o promotor de IGH: a ciclina D1 passa a ser transcrita de forma constitutiva, e é isso que a imuno-histoquímica enxerga no núcleo.',
            },
          ],
        },
      ],
    },
  ],
}
