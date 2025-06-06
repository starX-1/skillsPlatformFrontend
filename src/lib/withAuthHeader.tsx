export const withAuthHeader = (token: string | null) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});
