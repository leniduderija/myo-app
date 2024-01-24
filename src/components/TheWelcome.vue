<script setup lang="ts">
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'
</script>

<template>
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Documentation</template>

    Instructions on using the project are in <code>README.md</code> The code can be found on Github
    repo
    <a href="https://github.com/leniduderija/myo-app" target="_blank" rel="noopener">myo-app</a>.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>Tooling</template>

    This project is served and bundled with
    <a href="https://vitejs.dev/guide/features.html" target="_blank" rel="noopener">Vite</a>.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>Contact</template>

    If you have question you can contact me on
    <a href="mailto:leni.duderija@gmail.com" target="_blank" rel="noopener">e-mail</a>, or reach me
    on phone
    <a href="tel:'385958115948" target="_blank" rel="noopener">(+385)958115948</a>
  </WelcomeItem>
</template>
