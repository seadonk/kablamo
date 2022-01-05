import {areSetsEqual} from "@kablamo/utils";

describe('utils', () => {
  describe('areSetsEqual', () => {
    it('should return false if sets are not the same size', () => {
      const a = new Set([1]);
      const b = new Set([1,2,3]);
      expect(areSetsEqual(a,b)).toBeFalsy();
    })
    it('should return false if sets do not have the same values', () => {
      const a = new Set([1,2,3]);
      const b = new Set([1,2,4]);
      expect(areSetsEqual(a,b)).toBeFalsy();
    })
    it('should return true if both sets are empty', () => {
      const a = new Set();
      const b = new Set();
      expect(areSetsEqual(a,b)).toBeTruthy();
    })
    it('should return true if both sets are the same size and have the same values', () => {
      const a = new Set([1,2,3]);
      const b = new Set([1,2,3]);
      expect(areSetsEqual(a,b)).toBeTruthy();
    })
  })
})
