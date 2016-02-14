import './styles/main.scss';
import App from './scripts/app';

window.onload = () => {
    const app = new App(document.getElementById('app-container'));
    app.init().then(() => { app.start(); });
}
