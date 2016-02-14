
class CommandsAdapter {

    init(renderer) {
        this.renderer = renderer;
        window.renderer = renderer;
    }

    greeting = () => {
        this.renderer.showHeader().then(() => {
            this.renderer.greeting({ name: 'Bob' });
        });
    };
}

export const adapter = new CommandsAdapter();

export const commands = {
    greeting: [
        {
            name: 'hello',
            command: /^(привет|ок|окей) (Альпен|альпин|алиби)/,
            action: adapter.greeting
        }
    ]
};

export default {
    commands,
    adapter
};
