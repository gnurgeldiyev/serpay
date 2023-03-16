<template>
    <div v-if="error && error.statusCode && error.message" class="error">
        <img :src="'404.png'" class="error_image" />
        <h1 class="error_code">
            {{ error.statusCode }}
        </h1>
        <h3 class="error_message">
            {{ error.message }}
        </h3>
        <p class="error_action">
            <nuxt-link to="/"> Homepage </nuxt-link>
        </p>
    </div>
    <div v-else>
        <h1 class="error_code">Sorry</h1>
        <h3 class="error_message">An error occuried.</h3>
        <p class="error_action">
            <nuxt-link to="/"> Homepage </nuxt-link>
        </p>
    </div>
</template>
<script>
export default {
    name: 'ErrorLayout',
    props: {
        error: {
            type: Object,
            required: true,
        },
    },
    head() {
        return {
            title: this.error.message,
        }
    },
}
</script>

<style>
@media (max-width: 639px) {
    .error {
        text-align: center;
    }
    .error_image {
        width: 100%;
        height: auto;
    }
    .error_code {
        color: #000001;
        font-size: 3em;
        line-height: 1;
        font-family: 'Inria Serif', Georgia, serif;
        font-weight: bold;
    }
    .error_message {
        color: #000001;
        font-size: 1.4em;
        line-height: 1;
        font-family: 'Inria Serif', Georgia, serif;
        font-weight: bold;
        margin: 16px 0 16px 0;
    }
    .error_action,
    .error_action a {
        color: #666666;
        font-size: 0.9em;
        line-height: 1.5;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-weight: 500;
        margin: 0 0 16px 0;
    }
}
@media (min-width: 640px) and (max-width: 959px) {
    .error {
        text-align: center;
    }
    .error_image {
        width: 100%;
        height: auto;
    }
    .error_code {
        color: #000001;
        font-size: 3em;
        line-height: 1;
        font-family: 'Inria Serif', Georgia, serif;
        font-weight: bold;
    }
    .error_message {
        color: #000001;
        font-size: 1.5em;
        line-height: 1;
        font-family: 'Inria Serif', Georgia, serif;
        font-weight: bold;
        margin: 16px 0 16px 0;
    }
    .error_action,
    .error_action a {
        color: #666666;
        font-size: 0.9em;
        line-height: 1;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-weight: 500;
        margin: 0 0 16px 0;
    }
}
@media (min-width: 960px) and (max-width: 1279px) {
    .error {
        text-align: center;
    }
    .error_image {
        width: 70%;
        height: auto;
    }
    .error_code {
        color: #000001;
        font-size: 4.4em;
        line-height: 1;
        font-family: 'Inria Serif', Georgia, serif;
        font-weight: bold;
    }
    .error_message {
        color: #000001;
        font-size: 2.2em;
        line-height: 1;
        font-family: 'Inria Serif', Georgia, serif;
        font-weight: bold;
        margin: 32px 0 16px 0;
    }
    .error_action,
    .error_action a {
        color: #666666;
        font-size: 0.9em;
        line-height: 1;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-weight: 500;
        margin: 0 0 16px 0;
    }
}
@media (min-width: 1280px) {
    .error {
        text-align: center;
    }
    .error_image {
        width: 50%;
        height: auto;
    }
    .error_code {
        color: #000001;
        font-size: 5em;
        line-height: 1;
        font-family: 'Inria Serif', Georgia, serif;
        font-weight: bold;
    }
    .error_message {
        color: #000001;
        font-size: 2.4em;
        line-height: 1;
        font-family: 'Inria Serif', Georgia, serif;
        font-weight: bold;
        margin: 32px 0 16px 0;
    }
    .error_action,
    .error_action a {
        display: inline;
        color: #666666;
        font-size: 1em;
        line-height: 1;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-weight: 500;
        padding-bottom: 2px;
        margin: 0 0 16px 0;
        text-decoration: none;
        border-bottom: 1px solid #666666;
    }
}
</style>
