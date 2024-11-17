import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const Roles = {
    Buyer: 'ROLE_BUYER',
    Associate: 'ROLE_ASSOCIATE'
}

const useUserRoles = create((set) => ({
    userRole: null,
    setUserRoles: async (roles) => {
        if (roles.length === 0) {
            throw new Error('User has no roles assigned.');
        }

        if (roles.includes('ROLE_ASSOCIATE')) {
            const associate = 'ROLE_ASSOCIATE';
            set({ userRole: associate });
            try {
                await AsyncStorage.setItem('userRole', JSON.stringify(associate));
            } catch (error) {
                throw error;
            }
            return;
        }

        if (roles.includes('ROLE_BUYER')) {
            const  buyer = 'ROLE_BUYER';
            set({ userRole: buyer });
            try {
                await AsyncStorage.setItem('userRole', JSON.stringify(buyer));
            } catch (error) {
                throw error;
            }
            return;
        }

        throw new Error('Invalid user roles.');
    },

    loadUserRole: async () => {
        try {
            const userMode = await AsyncStorage.getItem("userRole");
            set({ userRole: JSON.parse(userMode)});
        } catch (error) {
            throw error;
        }
    }
}));

export default useUserRoles;
export { Roles }
