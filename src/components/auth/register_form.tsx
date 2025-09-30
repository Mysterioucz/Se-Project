export default function RegisterForm() {
    return (
        <form>
            <h1>Register</h1>
            <label>
                Email:
                <input type="email" name="email" required />
            </label>
            <label>
                Password:
                <input type="password" name="password" required />
            </label>
            <button type="submit">Register</button>
        </form>
    );
}
