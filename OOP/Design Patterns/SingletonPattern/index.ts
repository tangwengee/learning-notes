class SingletonShoppingCart{
    private static instance: SingletonShoppingCart;

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() { }

    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(): SingletonShoppingCart {
        if(!SingletonShoppingCart.instance){
            SingletonShoppingCart.instance = new SingletonShoppingCart();
        }

        return SingletonShoppingCart.instance;
    }

    /**
     * Finally, any singleton should define some business logic, which can be
     * executed on its instance.
     */
    public someBusinessLogic() {
        // ...
    }

}

/**
 * The client code.
 */
function clientCode() {
    const s1 = SingletonShoppingCart.getInstance();
    const s2 = SingletonShoppingCart.getInstance();

    if (s1 === s2) {
        console.log('Singleton works, both variables contain the same instance.');
    } else {
        console.log('Singleton failed, variables contain different instances.');
    }
}

clientCode();
