
export type TableType = 'Client' | 'UserWorker';

const baseColumns = [
    "first_name",
    "last_name",
    "email",
    "phone",
    "gender",
    "status",
    "avatar",
];

const additionalColumns: Record<TableType, string[]> = {
    Client: [
        "address",
        "city",
        "country",
        "zip_code",
        "state_province",
        "date_of_birth",
    ],
    UserWorker: [
        "address",
        "city",
        "country",
        "zip_code",
        "state_province",
        "date_of_birth",
        "salary_hour",
        "salary_day",
        "job_position",
        "employment_date",
        "salary_month",
    ]
};

export const getColumns = (table: TableType): string[] => [
    ...baseColumns,
    ...(additionalColumns[table] || [])
];
