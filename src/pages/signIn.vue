<template>
    <div class="login-container row no-wrap">
        <!-- 左侧图示 -->
        <div class="left-panel col-8 flex flex-center bg-blue-7">
            <!-- <img src="https://via.placeholder.com/400x320" alt="Login Illustration" class="login-image" /> -->
        </div>

        <!-- 右侧登录表单 -->
        <div class="right-panel col-4 flex flex-center">
            <div class="form-container" v-if="isShowSinIn">
                <!-- <div class="logo-container">
                    <img src="https://via.placeholder.com/100" alt="Logo" class="logo" />
                </div> -->
                <div class="welcome-text">Sign in</div>
                <div class="text-grey-8 q-mb-md">Sign in below to access your account</div>
                <q-form @submit="onSubmit" class="login-form">
                    <q-input filled v-model="signIn.username" label="Username" dense class="q-mb-md"
                        :rules="[val => !!val || 'Username is required']" />
                    <q-input filled v-model="signIn.password" label="Password" type="password" dense class="q-mb-md"
                        :rules="[val => !!val || 'Password is required']" />
                    <div class="row justify-between q-mb-md">
                        <q-checkbox v-model="signIn.rememberMe" label="Remember me" />
                        <q-btn flat label="Forgot Password?" class="text-primary" />
                    </div>
                    <q-btn label="LOGIN" color="blue-4" push class="full-width" type="submit" />
                </q-form>
                <div class="text-grey-8 q-mt-md">Don't have an account yet?
                    <q-btn flat label="Sign Up" class="text-primary" @click="isShowSinIn = false" />
                </div>
            </div>

            <div v-else class="form-container">
                <!-- <div class="logo-container">
                    <img src="https://via.placeholder.com/100" alt="Logo" class="logo" />
                </div> -->
                <h2 class="welcome-text">CREATE ACCOUNT</h2>
                <q-form @submit="signUpSubmit" class="register-form">
                    <!-- 用户名 -->
                    <q-input filled v-model="signup.username" label="Username" dense class="q-mb-md"
                        :rules="[val => !!val || 'Username is required']" />
                    <!-- 邮箱 -->
                    <q-input filled v-model="signup.email" label="Email" type="email" dense class="q-mb-md"
                        :rules="[val => !!val || 'Email is required']" />
                    <!-- 密码 -->
                    <q-input filled v-model="signup.password" label="Password" type="password" dense class="q-mb-md"
                        :rules="[val => !!val || 'Password is required']" />
                    <!-- 确认密码 -->
                    <q-input filled v-model="signup.confirmPassword" label="Confirm Password" type="password" dense
                        class="q-mb-md" :rules="[val => val === signup.password || 'Passwords do not match']" />
                    <!-- 同意条款 -->
                    <q-checkbox v-model="signup.agreeToTerms" label="I agree to the terms and conditions"
                        class="q-mb-md" :rules="[(val: boolean) => val || 'You must agree to the terms']" />
                    <!-- 注册按钮 -->
                    <q-btn label="REGISTER" color="blue" push class="full-width" type="submit" />
                </q-form>
                <q-btn label="< Back" color="black" flat type="submit" class="q-mt-md" @click="isShowSinIn = true" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">


import { ref } from 'vue';

const signIn = ref({
    username: '',
    password: '',
    rememberMe: false,
})

const signup = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
})

const isShowSinIn = ref(true);

function onSubmit() {
    if (signIn.value.username && signIn.value.password) {
        alert('Login successful!');
    } else {
        alert('Please fill in all fields.');
    }
}

function signUpSubmit() {
    if (signup.value.username && signup.value.email && signup.value.password && signup.value.confirmPassword && signup.value.agreeToTerms) {
        alert('Registration successful!');
    } else {
        alert('Please fill in all fields.');
    }
}
</script>

<style scoped>
.login-container {
    width: 100%;
    height: 100vh;
}

.right-panel {
    padding: 2rem;
}

.form-container {
    width: 80%;
    max-width: 400px;
    text-align: center;
}

.logo {
    width: 80px;
    height: auto;
}

.welcome-text {
    font-size: 1.5rem;
    font-weight: bold;
}

.login-form {
    width: 100%;
}

.full-width {
    width: 100%;
}
</style>