const ROLE = {
    ADMIN: 'admin',
    BASIC: 'basic'
}

module.exports = {
    ROLE: ROLE,
    users: [
        { id: 1, name: "Dami", role: ROLE.ADMIN},
        { id: 2, name: "Kassie", role: ROLE.BASIC},
        { id: 3, name: "Sean", role: ROLE.BASIC},
        { id: 4, name: "John", role: ROLE.BASIC},
        { id: 5, name: "Alex", role: ROLE.BASIC}
    ],
    projects: [
        { id: 1, name: "Dami", userId: 1},
        { id: 2, name: "Kassie", userId: 1},
        { id: 3, name: "Sean", userId: 1},
        { id: 4, name: "John", userId: 1},
        { id: 5, name: "Alex", userId: 1}
    ]
}