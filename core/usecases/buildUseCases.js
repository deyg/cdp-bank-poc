import { DepositarUseCase } from './Depositar.js';
import { SacarUseCase } from './Sacar.js';
import { TransferirUseCase } from './Transferir.js';
import { CriarContaUseCase } from './CriarConta.js';

export function buildUseCases(repository) {
  if (!repository) {
    throw new TypeError('repository é obrigatório');
  }
  return {
    criarConta: new CriarContaUseCase(repository),
    deposito: new DepositarUseCase(repository),
    saque: new SacarUseCase(repository),
    transferencia: new TransferirUseCase(repository),
  };
}
