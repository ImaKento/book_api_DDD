import { createCategoryId, type CategoryId } from '../valueObject/primaryId.js';
import {
    type String50ValueObject,
    createString50From,
    type OptionalString100ValueObject,
    createString100From,
    createOptionalString100From,
} from '../valueObject/wordCount.js';

export interface CategoryEntityProps {
    id: CategoryId;
    name: String50ValueObject;
    description: OptionalString100ValueObject;
    created_at: Date;
    updated_at: Date;
}

export class CategoryEntity implements CategoryEntityProps {
    private _id: CategoryId;
    private _name: String50ValueObject;
    private _description: OptionalString100ValueObject;
    private _created_at: Date;
    private _updated_at: Date;

    constructor(props: CategoryEntityProps) {
        this._id = props.id;
        this._name = props.name;
        this._description = props.description;
        this._created_at = props.created_at;
        this._updated_at = props.updated_at;
    }
    get id(): CategoryId {
        return this._id;
    }
    get name(): String50ValueObject {
        return this._name;
    }
    get description(): OptionalString100ValueObject {
        return this._description;
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
    set description(description: OptionalString100ValueObject) {
        this._description = createOptionalString100From(description);
    }
    
    static create(
        props: Omit<CategoryEntityProps, 'id' | 'created_at' | 'updated_at'>
    ): CategoryEntity {
        return new CategoryEntity({
            id: createCategoryId(),
            name: props.name,
            description: props.description ?? createString100From(''),
            created_at: new Date(),
            updated_at: new Date(),
        });
    }
}
