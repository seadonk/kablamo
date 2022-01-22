import {Codes, getKeysFromGuess, isGuessCorrect} from "@kablamo/mastermind";

describe('mastermind utils', () => {
  describe('isGuessCorrect', () => {
    it('should return false if no codes are a partial or exact match', () => {
      const guess: Codes = ['blue', 'blue', 'blue', 'blue'];
      const secret: Codes = ['red', 'green', 'red', 'red'];
      expect(isGuessCorrect(secret, guess)).toEqual(false);
    })
    it('should return false if some codes partially match', () => {
      const guess: Codes = ['blue', 'red', 'blue', 'blue'];
      const secret: Codes = ['red', 'green', 'red', 'red'];
      expect(isGuessCorrect(secret, guess)).toEqual(false);
    })
    it('should return true if all codes match exactly', () => {
      const guess: Codes = ['red', 'green', 'red', 'red'];
      const secret: Codes = ['red', 'green', 'red', 'red'];
      expect(isGuessCorrect(secret, guess)).toEqual(true);
    })
  })

  describe('getKeysFromGuess', () => {
    it('should not mutate the secret and guess parameters', () => {
      const guess: Codes = ['red', 'green', 'red', 'red'];
      const secret: Codes = ['red', 'green', 'red', 'red'];
      const keys = getKeysFromGuess(secret, guess);
      expect(guess).toStrictEqual(['red', 'green', 'red', 'red']);
      expect(secret).toStrictEqual(['red', 'green', 'red', 'red']);
    })
    it('should output keys of the same length as the guess', () => {
      const guess: Codes = ['blue', 'blue', 'blue', 'blue'];
      const secret: Codes = ['red', 'green', 'red', 'red'];
      const keys = getKeysFromGuess(secret, guess);
      expect(keys).toHaveLength(guess.length);
    })
    it('should output keys for a guess with no exact or partial guess', () => {
      const guess: Codes = ['blue', 'blue', 'blue', 'blue'];
      const secret: Codes = ['red', 'green', 'red', 'red'];
      const keys = getKeysFromGuess(secret, guess);
      expect(keys.every(t => t === 'none')).toBeTruthy();
    })
    it('should output keys for a guess with some partial guesses', () => {
      const guess: Codes = ['blue', 'red', 'green', 'green', 'blue'];
      const secret: Codes = ['red', 'green', 'red', 'red', 'red'];
      const keys = getKeysFromGuess(secret, guess);
      const exact = keys.filter(t => t === 'exact');
      const partial = keys.filter(t => t === 'partial');
      expect(exact).toHaveLength(0);
      expect(partial).toHaveLength(2);
    })
    it('should output keys for a guess with some exact guesses', () => {
      const guess: Codes = ['blue', 'green', 'blue', 'blue', 'red'];
      const secret: Codes = ['red', 'green', 'red', 'red', 'red'];
      const keys = getKeysFromGuess(secret, guess);
      const exact = keys.filter(t => t === 'exact');
      const partial = keys.filter(t => t === 'partial');
      expect(exact).toHaveLength(2);
      expect(partial).toHaveLength(0);
    })
    it('should output keys for a guess with some partial and some exact guesses', () => {
      const guess: Codes = ['red', 'red', 'green', 'red', 'blue'];
      const secret: Codes = ['red', 'green', 'red', 'red', 'red'];
      const keys = getKeysFromGuess(secret, guess);
      const exact = keys.filter(t => t === 'exact');
      const partial = keys.filter(t => t === 'partial');
      expect(exact).toHaveLength(2);
      expect(partial).toHaveLength(2);
    })
    it('should output keys for a guess that is correct', () => {
      const guess: Codes = ['red', 'green', 'red', 'red'];
      const secret: Codes = ['red', 'green', 'red', 'red'];
      const keys = getKeysFromGuess(secret, guess);
      expect(keys.every(t => t === 'exact')).toBeTruthy();
    })
  });
});
