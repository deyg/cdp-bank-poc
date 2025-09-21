import { DepositarUseCase } from './Depositar.js';
import { SacarUseCase } from './Sacar.js';
import { TransferirUseCase } from './Transferir.js';
import { CriarContaUseCase } from './CriarConta.js';
import { ConsultarSaldoUseCase } from './ConsultarSaldo.js';

export function buildUseCases(repository) {
  if (!repository) {
    throw new TypeError('repository é obrigatório');
  }
  return {
    criarConta: new CriarContaUseCase(repository),
    saldo: new ConsultarSaldoUseCase(repository),
    deposito: new DepositarUseCase(repository),
    saque: new SacarUseCase(repository),
    transferencia: new TransferirUseCase(repository),
  };
}
