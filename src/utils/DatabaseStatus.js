class DatabaseStatus {
    static isAvailable = true;

    static listeners = [];

    static setDatabaseAvailable(status) {
        this.isAvailable = status;
        this.notifyListeners();
    }

    static getDatabaseStatus() {
        return this.isAvailable;
    }

    static addListener(listener) {
        this.listeners.push(listener);
    }

    static removeListener(listener) {
        this.listeners = this.listeners.filter((l) => l !== listener);
    }

    static notifyListeners() {
        this.listeners.forEach((listener) => listener(this.isAvailable));
    }
}

export default DatabaseStatus;
