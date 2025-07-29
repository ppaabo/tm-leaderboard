<script setup lang="ts"></script>

<template>
  <nav>
    <ul>
      <li>
        <router-link :to="{ name: 'home' }"> Home</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'gamemodes' }"> Leaderboard</router-link>
      </li>
    </ul>
    <ul>
      <li>
        <router-link :to="{ name: 'login' }">Login</router-link>
      </li>
    </ul>
  </nav>
</template>
