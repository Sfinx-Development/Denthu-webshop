// src/types/payex.d.ts
declare namespace payex {
  const hostedView: {
    checkout(options: {
      container: {
        checkout: string;
      };
      culture: string;
    }): {
      open(): void;
    };
  };
}
