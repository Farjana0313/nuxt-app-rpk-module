<template>
    <button type="button" :class="[
        'px-2 py-1 rounded text-sm',
        color === 'red' ? 'text-red-600 hover:text-red-700' : 'text-blue-600 hover:text-blue-700'
    ]" @click="handleClick">
        {{ label }}
    </button>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue';

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: 'blue'
    },
    data: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['action']);

const handleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    emit('action', { type: props.action, data: props.data });
    console.log(`${props.action} button clicked with data:`, props.data);
};
</script>