<script setup lang="tsx">
import { useRoute } from 'vue-router'

const route = useRoute()

function CCard(props: { to: string; icon: string; title: string; desc: string | string[] }) {
  const desc = typeof props.desc === 'string' ? [props.desc] : props.desc

  return (
    <router-link
      to={props.to}
      class={[
        'flex gap-1 rounded p-2 hover:bg-stone-500 hover:text-gray-100',
        route.path === props.to
          ? 'bg-stone-400 text-gray-100'
          : props.to === '/2048/plus'
            ? 'text-orange-700'
            : 'text-yellow-900',
      ]}
    >
      <icon icon={props.icon} class="size-6" />
      <div>
        <h1 class="text-lg font-bold">{props.title}</h1>
        {desc.map((text) => (
          <p>{text}</p>
        ))}
      </div>
    </router-link>
  )
}

function CLink(props: { url?: string; text: string }) {
  return (
    <a class="hover:underline" href={props.url}>
      {props.text}
    </a>
  )
}
</script>

<template>
  <div class="bounce overflow-hidden rounded-xl bg-stone-300">
    <ul class="mx-2 mt-2">
      <c-card to="/2048" icon="ic:outline-star" title="Standard" desc="2048 with powerups" />
      <c-card
        to="/2048/classic"
        icon="ic:baseline-dashboard"
        title="Classic"
        desc="The original 2048, no undo"
      />
      <c-card
        to="/2048/tutorial"
        icon="ic:baseline-help"
        title="Tutorial"
        desc="Learn how to play 2048"
      />
      <c-card
        to="/2048/plus"
        icon="ic:baseline-extension"
        title="Plus"
        :desc="['Bonus powerups and dark board!', 'Available until November.']"
      />
    </ul>

    <ul class="mx-2 grid grid-cols-2 gap-0.5 border-t border-stone-400 p-2 text-xs">
      <c-link text="Give Feadback" />
      <c-link text="Get the App" />
      <c-link text="Privacy & Cookies" />
      <c-link text="Consent Preferences" />
      <c-link text="About" />
      <c-link text="Game not working?" />
      <c-link text="Play Solitaire" />
      <c-link text="Play Card Games" />
    </ul>

    <a
      href="https://play2048.co/"
      target="_blank"
      class="ea block bg-stone-400 py-1 text-center text-sm"
    >
      Go to the old 2048 ➔
    </a>
  </div>
</template>

<style scoped>
@keyframes bounce {
  50% {
    animation-timing-function: ease-out;
    transform: translateY(12px);
  }
}

.bounce {
  animation-name: bounce;
  animation-timing-function: ease-in;
  animation-duration: 200ms;
  animation-iteration-count: 1;
}
</style>
