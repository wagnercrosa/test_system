<?php

namespace App\Services\Nfse;

class Rps{

	private $data; 

	public function __construct($data){
	}

	public function getXml(){
		return '<?xml version="1.0" encoding="UTF-8" ?>
		<GerarNfseEnvio xmlns = "http://www.betha.com.br/e-nota-contribuinte-ws">
		<Rps>
		<InfDeclaracaoPrestacaoServico  Id="lote1">
		<Rps>
		<IdentificacaoRps>
		<Numero>23</Numero>
		<Serie>A1</Serie>
		<Tipo>1</Tipo>
		</IdentificacaoRps>
		<DataEmissao>2014-12-06</DataEmissao>
		<Status>1</Status>
		</Rps>
		<Competencia>2014-12-01</Competencia>
		<Servico>
		<Valores>
		<ValorServicos>100</ValorServicos>
		<ValorDeducoes>0</ValorDeducoes>
		<ValorPis>0</ValorPis>
		<ValorCofins>0</ValorCofins>
		<ValorInss>0</ValorInss>
		<ValorIr>0</ValorIr>
		<ValorCsll>0</ValorCsll>
		<OutrasRetencoes>0</OutrasRetencoes>
		<DescontoIncondicionado>0</DescontoIncondicionado>
		<DescontoCondicionado>0</DescontoCondicionado>	
		</Valores>
		<IssRetido>2</IssRetido>
		<ItemListaServico>0702</ItemListaServico>
		<CodigoTributacaoMunicipio>2525</CodigoTributacaoMunicipio>
		<Discriminacao>Prog.</Discriminacao>
		<CodigoMunicipio>4204608</CodigoMunicipio>
		<ExigibilidadeISS>1</ExigibilidadeISS>
		<MunicipioIncidencia>4204608</MunicipioIncidencia>
		</Servico>
		<Prestador>
		<CpfCnpj>
		<Cnpj>45111111111100</Cnpj>
		</CpfCnpj>
		<InscricaoMunicipal>123498</InscricaoMunicipal>
		</Prestador>
		<Tomador>
		<IdentificacaoTomador>
		<CpfCnpj>
		<Cnpj>83787494000123</Cnpj>
		</CpfCnpj>						
		</IdentificacaoTomador>
		<RazaoSocial>INSTITUICAO FINANCEIRA</RazaoSocial>
		<Endereco>
		<Endereco>AV. 7 DE SETEMBRO</Endereco>
		<Numero>1505</Numero>
		<Complemento>AO LADO DO JOAO AUTOMOVEIS</Complemento>
		<Bairro>CENTRO</Bairro>
		<CodigoMunicipio>4201406</CodigoMunicipio>
		<Uf>SC</Uf>
		<Cep>88900000</Cep>
		</Endereco>
		<Contato>
		<Telefone>4835220026</Telefone>
		<Email>bergman@tsmail.com</Email>
		</Contato>
		</Tomador>
		<Intermediario>
		<IdentificacaoIntermediario>
		<CpfCnpj>
		<Cnpj>06410987065144</Cnpj>
		</CpfCnpj>
		<InscricaoMunicipal>22252</InscricaoMunicipal>				
		</IdentificacaoIntermediario>
		<RazaoSocial>CONSTRUTORA TERRA FIRME</RazaoSocial>
		</Intermediario>
		<ConstrucaoCivil>
		<CodigoObra>142</CodigoObra>
		<Art>1/2014</Art>
		</ConstrucaoCivil>
		<RegimeEspecialTributacao>3</RegimeEspecialTributacao>
		<OptanteSimplesNacional>2</OptanteSimplesNacional>
		<IncentivoFiscal>2</IncentivoFiscal>
		</InfDeclaracaoPrestacaoServico>
		</Rps>
		</GerarNfseEnvio>';
	}

}