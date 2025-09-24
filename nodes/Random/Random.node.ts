import 
{
    IExecuteFunctions,
    INodeType,
    INodeTypeDescription,
    INodeExecutionData,
    NodeOperationError,
} from 'n8n-workflow';


/**
 * Implementa o nó "Random" para o n8n, que gera números aleatórios.
 */
export class Random implements INodeType 
{
    /**
     * Define a aparência e as propriedades do nó na interface do n8n.
     */
	description: INodeTypeDescription = 
    {
        // Atributos do node
		displayName: 'Random',
		name: 'random',
		icon: 'file:random.svg',
		group: ['transform'],
		version: 1,
		description: 'Gera um número aleatório entre dois parâmetros numéricos utilizando a API do RANDOM.ORG',
		defaults: 
        {
			name: 'Random',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: 
        [
			{   // Atributos da única operação
				displayName: 'Operação',
				name: 'operacao',
				type: 'options',
				noDataExpression: true,
				options: 
                [
					{
						name: 'True Random Number Generator',
						value: 'trueRandom',
						description: 'Gera um valor aleatório delimitado pelos parâmetros',
						action: 'Gera um número aleatório',
					},
				],
				default: 'trueRandom',
			},
			{   // Atributos do primeiro parâmetro
				displayName: 'Mínimo',
				name: 'min',
				type: 'number',
				default: 1,
				required: true,
				description: 'O valor mínimo da geração aleatória (incluso)',
			},
			{   // Atributos do segundo parâmetro
				displayName: 'Máximo',
				name: 'max',
				type: 'number',
				default: 100,
				required: true,
				description: 'O valor máximo da geração aleatória (incluso)',
			},
		],
	};

    /**
     * @brief Contém a lógica principal de execução do nó.
     * @description Este método é executado quando o nó é ativado em um workflow. Ele obtém os
     * parâmetros 'min' e 'max' pela interface, faz uma requisição para a API do RANdOM.ORG
     * e retorna o número aleatório gerado no formato de saída do n8n.
     * @returns {Promise<INodeExecutionData[][]>} Os dados de saída do nó para o próximo item no workflow.
     */
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> 
    {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) 
        {
            try 
            {
                // Obtém os parâmetros 'min' e 'max' definidos pelo usuário na interface.
                const min = this.getNodeParameter('min', i, 1) as number;
                const max = this.getNodeParameter('max', i, 100) as number;
                const apiUrl = `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;

                // Utiliza o helper httpRequest do n8n para fazer a chamada à API do RANDOM.ORG.
                const response = await this.helpers.httpRequest({
                    method: 'GET',
                    url: apiUrl,
                    json: false,
                });

                // Converte a resposta (texto) para um número inteiro.
                const randomNumber = parseInt(response as string, 10);
                
                // Estrutura os dados de retorno para o n8n.
                returnData.push({
                    json: 
                    {
                        randomNumber: randomNumber,
                    },
                });

            } 
            catch (error) 
            {
                // Se o nó estiver configurado para continuar em caso de falha, anexa o erro ao item e prossegue, em vez de parar o workflow.
                if (this.continueOnFail()) 
                {
                    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
                    const errorDetails = new NodeOperationError(this.getNode(), errorMessage, { itemIndex: i });
                    returnData.push({ json: this.getInputData(i)[0].json, error: errorDetails });
                    continue;
                }
                
                throw error;
            }

        }

        // Retorna os dados processados para serem usados pelos próximos nós no workflow.
        return [this.helpers.returnJsonArray(returnData)];
    }

}