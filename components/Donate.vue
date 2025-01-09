<script setup lang="ts">
import { createClientUPProvider } from "@lukso/up-provider";
import { ref, watch } from "vue";
import Web3, {
  type SupportedProviders,
  utils,
  type EthExecutionAPI,
} from "web3";

const chainId = ref<number | null>(null);
const accounts = ref<string[]>([]);
const contextAccounts = ref<string[]>([]);
const walletConnected = ref<boolean>(false);

// Allocate the client up provider.
let provider: SupportedProviders<EthExecutionAPI> | null = null;
onMounted(() => {
  provider = createClientUPProvider();
  const web3 = new Web3(provider as SupportedProviders<EthExecutionAPI>);
  // Initially retrieve chainId and accounts
  web3.eth
    ?.getChainId()
    .then((_chainId) => {
      chainId.value = Number(_chainId);
      walletConnected.value =
        accounts.value.length > 0 && contextAccounts.value.length > 0;
    })
    .catch((error) => {
      // Ignore error
    });
  web3.eth
    ?.getAccounts()
    .then((_accounts) => {
      accounts.value = _accounts || [];
    })
    .catch((error) => {
      // Ignore error
    });
  provider
    .request("up_contextAccounts", [])
    .then((_accounts) => {
      contextAccounts.value = _accounts || [];
    })
    .catch((error) => {
      // Ignore error
    });
  // Monitor accountsChanged and chainChanged events
  provider.on("accountsChanged", (_accounts: `0x${string}`[]) => {
    accounts.value = [..._accounts];
  });
  provider.on("contextAccountsChanged", (_accounts: `0x${string}`[]) => {
    contextAccounts.value = [..._accounts];
  });
  provider.on("chainChanged", (_chainId: number) => {
    chainId.value = _chainId;
  });
});

// Watch all changes and compose a walletConnected boolean flag
watch(
  () =>
    [chainId.value, accounts.value, contextAccounts.value] as [
      number,
      Array<`0x${string}`>,
      Array<`0x${string}`>
    ],
  ([chainId, accounts, contextAccounts]: [
    number,
    Array<`0x${string}`>,
    Array<`0x${string}`>
  ]) => {
    walletConnected.value =
      accounts?.length > 0 &&
      contextAccounts?.length > 0 &&
      (chainId === 42 || chainId === 4201);
  }
);

const error = ref(""); // Error message for validation feedback
const amount = ref(1);

// Validation limits
const minAmount = 0.25; // Minimum allowed value
const maxAmount = 1000; // Maximum allowed value

// Watch and validate input
const validateAmount = () => {
  if (amount.value < minAmount) {
    error.value = `Amount must be at least ${minAmount} LYX.`;
  } else if (amount.value > maxAmount) {
    error.value = `Amount cannot exceed ${maxAmount} LYX.`;
  } else {
    error.value = ""; // Clear error if valid
  }
};

// Optionally validate immediately on load or updates
watch(amount, validateAmount);
async function donate() {
  web3.eth.sendTransaction(
    {
      from: accounts.value[0],
      to: contextAccounts.value[0],
      value: utils.toWei(amount.value, "ether"),
    },
    undefined,
    { checkRevertBeforeSending: false }
  );
}
</script>

<template>
  <div
    class="flex flex-col border-2 border-gray-300 rounded-lg p-5 bg-gray-100 shadow-lg text-center"
  >
    <h3 class="text-lg font-bold text-gray-800">
      Donate LYX to<br />
      <small class="text-gray-600">{{
        contextAccounts.length > 0 ? contextAccounts[0] : "not connected"
      }}</small>
    </h3>
    <div class="mt-4">
      <label for="amount" class="block text-sm font-medium text-gray-700 mb-2"
        >Enter Amount:</label
      >
      <input
        id="amount"
        type="number"
        v-model.number="amount"
        :min="minAmount"
        :max="maxAmount"
        step="1"
        @input="validateAmount"
        class="w-full p-2 border border-gray-300 rounded-lg mb-3 focus:ring focus:ring-blue-500 focus:outline-none"
      />
      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
    </div>
    <button
      :disabled="!walletConnected || !amount"
      @click="donate"
      class="w-full p-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
    >
      Donate {{ amount }} LYX
    </button>
  </div>
</template>
