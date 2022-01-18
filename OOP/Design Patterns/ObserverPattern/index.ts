// Reference: https://refactoring.guru/design-patterns/observer/typescript/example

interface Publisher {
    attach(observer: Observer): void;
    detach(observer: Observer): void;
    notify():void;
}

class ConcretePublisher implements Publisher {
    public state: number;

    private observerList: Observer[] = [];

    public attach(observer: Observer): void {
        // @ts-ignore
        const isExist = this.observerList.includes(observer);
        if(isExist){
            return console.log('Subject: Observer has been attached already');
        }

        console.log('Subject: Attached an observer');
        this.observerList.push(observer)
    }

    public detach(observer: Observer): void {
        const observerIndex = this.observerList.indexOf(observer);
        if(observerIndex === -1){
            return console.log('Subject: Nonexistent observer.');
        }

        this.observerList.splice(observerIndex, 1);
        console.log('Subject: Detached an observer.')
    }

    public notify(): void {
        console.log('Subject: Notifying observers...');
        for(const observer of this.observerList){
            observer.update(this);
        }
    }

    /**
     * Usually, the subscription logic is only a fraction of what a Subject can
     * really do. Subjects commonly hold some important business logic, that
     * triggers a notification method whenever something important is about to
     * happen (or after it).
     */
    public someBusinessLogic(): void {
        console.log('\nSubject: I\'m doing something important.');
        this.state = Math.floor(Math.random() * (10 + 1));

        console.log(`Subject: My state has just changed to: ${this.state}`);
        this.notify();
    }

}

interface Observer {
    update(publisher: Publisher): void;
}

class ConcreteObserverA implements Observer {
    public update(publisher: Publisher): void {
        if(publisher instanceof ConcretePublisher && publisher.state < 3){
            console.log('ConcreteObserverA: Reacted to the event.');
        }
    }
}

class ConcreteObserverB implements Observer {
    public update(publisher: Publisher): void {
        if(publisher instanceof ConcretePublisher && (publisher.state === 0 || publisher.state >= 2)){
            console.log('ConcreteObserverB: Reacted to the event.');
        }
    }
}

/**
 * The client code.
 */

const subject = new ConcretePublisher();

const observer1 = new ConcreteObserverA();
subject.attach(observer1);
const observer2 = new ConcreteObserverB();
subject.attach(observer2);

subject.someBusinessLogic();
subject.someBusinessLogic();

subject.detach(observer2);

subject.someBusinessLogic();


