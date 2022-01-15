<template>
    <div id="app">
      <router-view/>
    </div>
</template>
<style lang="scss">
    *::-webkit-scrollbar-thumb {
        background: #24b9dd;
        border-radius: 10px;
    }

    *::-webkit-scrollbar {
        width: 10px;
        cursor: pointer;
        background-color: #000;
    }

    body {
      position: relative;
      background-image: url('./assets/universe.jpg');
    }
</style>
