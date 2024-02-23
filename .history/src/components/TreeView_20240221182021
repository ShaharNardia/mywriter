<template>
  <div class="tree-view">
    <div class="node">
      <div><strong>Title:</strong> {{ data.title }}</div>
    </div>
    <div class="node">
      <div><strong>Content:</strong> {{ data.content }}</div>
    </div>
    <div class="node">
      <div><strong>Preview Content:</strong> {{ data.previewContent }}</div>
    </div>
    <div class="node">
      <div><strong>Keywords:</strong>
        <ul>
          <li v-for="keyword in data.keywords" :key="keyword">{{ keyword }}</li>
        </ul>
      </div>
    </div>
    <div class="node">
      <div>
        <strong>Image:</strong>
        <img :src="data.image" alt="Image" style="width: 100px; height: auto;">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TreeView',
  props: {
    data: Object,
  },
};
</script>

<style>
.node {
  margin-bottom: 10px;
}
.node strong {
  margin-right: 5px;
}
</style>
