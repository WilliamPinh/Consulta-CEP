document.addEventListener('DOMContentLoaded', function () {
    const cepInput = document.getElementById('cep-input');
    const consultarBtn = document.getElementById('consultar-btn');
    const resultDiv = document.getElementById('result');
    const salvarBtn = document.getElementById('salvar-btn');
    const savedTableBody = document.getElementById('saved-table').querySelector('tbody');

    consultarBtn.addEventListener('click', () => {
        const cep = cepInput.value.trim();
        if (cep.length === 8) {
            consultarCep(cep);
        } else {
            alert('Por favor, digite um CEP válido com 8 dígitos.');
        }
    });

    salvarBtn.addEventListener('click', salvarEndereco);

    function consultarCep(cep) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    resultDiv.innerHTML = '<p>CEP não encontrado.</p>';
                    salvarBtn.disabled = true;
                } else {
                    resultDiv.innerHTML = `
                        <table class="result-table">
                            <tr>
                                <th>CEP</th>
                                <th>Logradouro</th>
                                <th>Estado</th>
                                <th>Cidade</th>
                                <th>Bairro</th>
                                <th>DDD</th>
                                <th>IBGE</th>
                                <th>Siafi</th>
                            </tr>
                            <tr>
                                <td>${data.cep}</td>
                                <td>${data.logradouro}</td>
                                <td>${data.uf}</td>
                                <td>${data.localidade}</td>
                                <td>${data.bairro}</td>
                                <td>${data.ddd}</td>
                                <td>${data.ibge}</td>
                                <td>${data.siafi}</td>
                            </tr>
                        </table>
                    `;
                    salvarBtn.disabled = false;
                    salvarBtn.dataset.endereco = JSON.stringify(data);
                }
            })
            .catch(error => {
                console.error('Erro na consulta do CEP:', error);
                resultDiv.innerHTML = '<p>Ocorreu um erro ao consultar o CEP.</p>';
                salvarBtn.disabled = true;
            });
    }

    function salvarEndereco() {
        const endereco = JSON.parse(salvarBtn.dataset.endereco);
        let enderecosSalvos = JSON.parse(localStorage.getItem('enderecos')) || [];
        enderecosSalvos.push(endereco);
        localStorage.setItem('enderecos', JSON.stringify(enderecosSalvos));
        exibirEnderecosSalvos();
    }

    function exibirEnderecosSalvos() {
        let enderecosSalvos = JSON.parse(localStorage.getItem('enderecos')) || [];
        savedTableBody.innerHTML = ''; 

        enderecosSalvos.forEach((endereco, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${endereco.cep}</td>
                <td>${endereco.logradouro}</td>
                <td>${endereco.uf}</td>
                <td>${endereco.localidade}</td>
                <td>${endereco.bairro}</td>
                <td>${endereco.ddd}</td>
                <td>${endereco.ibge}</td>
                <td>${endereco.siafi}</td>
                <td><button class="remove-btn" onclick="deletarEndereco(${index})">Deletar</button></td>
            `;
            savedTableBody.appendChild(row);
        });
    }

    window.deletarEndereco = function (index) {
        if (confirm('Você realmente deseja deletar este endereço?')) {
            let enderecosSalvos = JSON.parse(localStorage.getItem('enderecos')) || [];
            enderecosSalvos.splice(index, 1);
            localStorage.setItem('enderecos', JSON.stringify(enderecosSalvos));
            exibirEnderecosSalvos();
        }
    }

    exibirEnderecosSalvos();
});