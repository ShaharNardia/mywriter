<template>
    <div class="content-creation">
        <h2>Create Content</h2>
        <form @submit.prevent="generateContent">
            <!-- Title input -->
            <div class="form-group">
                <label for="title">Title</label>
                <input type="text" id="title" v-model="title" required>
            </div>

            <!-- Purpose selection -->
            <div class="form-group">
                <label for="purpose">Purpose</label>
                <div class="checkbox-group">
                    <label>
                        <input type="checkbox" value="seo" v-model="purpose"> SEO
                    </label>
                    <label>
                        <input type="checkbox" value="homework" v-model="purpose"> Homework
                    </label>
                    <!-- Add more options for other purposes -->
                </div>
            </div>

            <!-- Category input -->
            <div class="form-group">
                <label for="category">Category</label>
                <input type="text" id="category" v-model="category">
            </div>

            <!-- Image preferences -->
            <div class="form-group">
                <label for="generateImage">Generate Image</label>
                <input type="checkbox" id="generateImage" v-model="generateImage">
            </div>
            <div class="form-group" v-if="generateImage">
                <label for="imagePrompt">Image Prompt</label>
                <input type="text" id="imagePrompt" v-model="imagePrompt">
            </div>

            <!-- Audio preference -->
            <div class="form-group">
                <label for="generateAudio">Generate Audio</label>
                <input type="checkbox" id="generateAudio" v-model="generateAudio">
            </div>

            <!-- Language selection -->
            <div class="form-group">
                <label for="language">Language</label>
                <select id="language" v-model="language">
                    <option value="english">English</option>
                    <option value="hebrew">Hebrew</option>
                    <!-- Add more language options -->
                </select>
            </div>

            
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: '',
            purpose: [],
            category: '',
            generateImage: false,
            imagePrompt: '',
            generateAudio: false,
            language: 'english'
        };
    },
    methods: {
        generateContent() {

            const prompt = `{
    "title": "${this.title}",
    "purpose": ${JSON.stringify(this.purpose)},
    "category": "${this.category}",
    "generateImage": ${this.generateImage},
    "imagePrompt": "${this.imagePrompt}",
    "generateAudio": ${this.generateAudio},
    "language": "${this.language}"
}`;

            fetch('https://mywriter-48a45.firebaseapp.com/generateContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    userToken: 'Your user token here',
                }),
            })
                .then(response => response.json())
                .then(data => console.log(data))
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }
};
</script>

<style scoped>
.content-creation {
    /* Add your styles for the content-creation component here */
}

.form-group {
    /* Add your styles for the form-group class here */
}

.checkbox-group {
    /* Add your styles for the checkbox-group class here */
}

/* Add more styles as needed */
</style>
