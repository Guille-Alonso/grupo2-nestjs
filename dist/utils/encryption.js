"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokens = exports.comparePassword = exports.hashPassword = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, +process.env.HASH_SALT);
    }
    catch (error) {
        common_1.Logger.error('Error al generar el hash de la contraseña');
        throw error;
    }
};
exports.hashPassword = hashPassword;
const comparePassword = async (providedPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(providedPassword, hashedPassword);
    }
    catch (error) {
        common_1.Logger.error('Error al comparar la contraseña');
        throw error;
    }
};
exports.comparePassword = comparePassword;
const createTokens = async (payload, jwtService) => {
    return {
        accessToken: await jwtService.signAsync(payload),
    };
};
exports.createTokens = createTokens;
//# sourceMappingURL=encryption.js.map