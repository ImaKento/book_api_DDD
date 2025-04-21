import { createAuthorId, type AuthorId } from '../valueObject/primaryId.js'
import { 
    type String50ValueObject,
    createString50From
} from '../valueObject/wordCount.js';

export interface AuthorEntityProps {
    id: AuthorId;
    name: String50ValueObject,
    created_at: Date;
    updated_at: Date;
}

export class AuthorEntity implements AuthorEntityProps {
    private _id: AuthorId;
    private _name: String50ValueObject;
    private _created_at: Date;
    private _updated_at: Date;

    constructor(props: AuthorEntityProps) {
        this._id = props.id;
        this._name = props.name;
        this._created_at = props.created_at;
        this._updated_at = props.updated_at;
    }
    get id(): AuthorId {
        return this._id;
    }
    get name(): String50ValueObject {
        return this._name;
    }
    get created_at(): Date {
        return this._created_at;
    }
    get updated_at(): Date {
        return this._updated_at;
    }
    
    set name(name: String50ValueObject) {
        this._name = createString50From(name);
    }
    
    static create(
        props: Omit<AuthorEntityProps, 'id' | 'created_at' | 'updated_at'>
    ): AuthorEntity {
        return new AuthorEntity({
            id: createAuthorId(),
            ...props,
            created_at: new Date(),
            updated_at: new Date(),
        });
    }
}