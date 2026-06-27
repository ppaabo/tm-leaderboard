<script setup lang="ts">
import LoadingIndicator from "@/components/LoadingIndicator.vue";

const props = defineProps<{
  open: boolean;
  title: string;
  message: string;
  loading?: boolean;
  loadingMessage?: string;
  confirmText?: string;
  cancelText?: string;
}>();

const emit = defineEmits<{
  (e: "confirm"): void;
  (e: "cancel"): void;
  (e: "update:open", value: boolean): void;
}>();

const onCancel = () => {
  emit("cancel");
  emit("update:open", false);
};
</script>

<template>
  <dialog :open="props.open">
    <article>
      <header>
        <h2>{{ title }}</h2>
      </header>
      <p>{{ message }}</p>
      <slot />
      <LoadingIndicator
        v-if="loading"
        inline
        :message="loadingMessage ?? 'Working...'"
      />
      <footer>
        <button class="secondary" @click="onCancel" :disabled="loading">
          {{ cancelText ?? "Cancel" }}
        </button>
        <button @click="emit('confirm')" :disabled="loading">
          {{ confirmText ?? "Confirm" }}
        </button>
      </footer>
    </article>
  </dialog>
</template>
