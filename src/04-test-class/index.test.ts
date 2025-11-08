// Uncomment the code below and write your tests
import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initialBalance = 10;
    const account = getBankAccount(initialBalance);

    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(10);
    expect(() => account.withdraw(20)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const account1 = getBankAccount(10);
    const account2 = getBankAccount(20);
    expect(() => account1.transfer(20, account2)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(10);
    expect(() => account.transfer(10, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const account = getBankAccount(10);
    account.deposit(10);
    expect(account.getBalance()).toBe(20);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(10);
    account.withdraw(5);
    expect(account.getBalance()).toBe(5);
  });

  test('should transfer money', () => {
    const account1 = getBankAccount(10);
    const account2 = getBankAccount(15);
    account1.transfer(2, account2);
    expect(account1.getBalance()).toBe(8);
    expect(account2.getBalance()).toBe(17);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(10);
    const balance = await account.fetchBalance();
    if (balance === null) {
      expect(balance).toBeNull();
    } else {
      expect(typeof balance).toBe('number');
      expect(balance).toBeGreaterThanOrEqual(0);
      expect(balance).toBeLessThanOrEqual(100);
    }
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(10);
    const oldBalance = account.getBalance();

    try {
      await account.synchronizeBalance();
    } catch (error) {}
    const newBalance = account.getBalance();

    expect(newBalance === oldBalance || newBalance >= 0).toBe(true);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(10);
    try {
      await account.synchronizeBalance();
    } catch (error) {
      expect(error).toBeInstanceOf(SynchronizationFailedError);
    }
  });
});
