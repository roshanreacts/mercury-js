---
sidebar_position: 8
title: Hooks
---

## Mercury.js: Defining Hook Execution for Models and Actions


Mercury.js provides an advanced mechanism for adding before and after hooks to actions on your application's models. Hooks allow you to execute custom logic before or after certain operations, giving you granular control over the behavior of your data models.

### Hook Levels

Mercury.js hooks can be executed at different stages:
- **`Before Hooks`**: Run before an action occurs on a model.
- **`After Hooks`**: Run after an action occurs on a model.

Each model can have hooks attached to specific actions:
- **`Create`**: Executed before or after creating a new record.
- **`Update`**: Executed before or after modifying an existing record.
- **`Delete`**: Executed before or after removing an existing record.

###  Hook Syntax:



To define hook, use the `mercury.hook.before` and `mercury.hook.after`  methods.

```typescript
// Define a before hook
mercury.hook.before(action: string, handler: Function);

// Define an after hook
mercury.hook.after(action: string, handler: Function);
```
`mercury.hook.before` and `mercury.hook.after` are methods  which allows  you to specify custom logic for actions on a model.

The   **`action`** parameter is a string that represents the specific operation on a model to which the hook is attached. 


### Hook Actions
***For example***: let's asssume DOCUMENT would be the model.
 "CREATE_DOCUMENT" will target the create operation of a document model. Each hook can be tied to different actions such as "CREATE", "UPDATE", or "DELETE" depending on the custom logic to run.

***`1. Create Hook`***

In this example, we add custom logic before and after creating a new document in the Document model.
```typescript
import mercury from "@mercury-js/core";
// Define a before hook for the "create" action
mercury.hook.before("CREATE_DOCUMENT", (params) => {
  console.log("Before creating a document: ", params);
});

// Define an after hook for the "create" action
mercury.hook.after("CREATE_DOCUMENT", (params, context) => {
  console.log("After document creation: ", context);
});
```
***Defining a ***`before`*** Hook:***

A before hook is triggered before the "CREATE_DOCUMENT" action occurs.
The hook listens for this action and takes in a params argument, which likely contains data related to the document being created (such as its fields and values).
The hook then logs a message, displaying the params to provide insights into the document that is about to be created.

***Purpose***: This hook can be used to perform validations, modify parameters, or trigger additional logic before the document creation process begins.

***Defining an ***`After`*** Hook:***

The after hook is triggered after the "CREATE_DOCUMENT" action has been completed.
This hook takes two arguments: params (same as the before hook, representing the document's data) and context, which likely contains additional information about the state or result after the document has been created.
It logs a message, displaying the context, which could include the document ID, any status information, or other metadata resulting from the creation.

***Purpose***: This hook can be used to execute tasks after the document creation, such as sending notifications, updating logs, or handling post-processing tasks.

***`2. Update Hook`***

In this example, we add custom logic before and after updating a document  in the Document model.
```typescript
import mercury from "@mercury-js/core";
// Define a before hook for the "update" action
mercury.hook.before("UPDATE_DOCUMENT", (params) => {
  console.log("Before updating a document: ", params);
});

// Define an after hook for the "update" action
mercury.hook.after("UPDATE_DOCUMENT", (params, context) => {
  console.log("After document updation: ", context);
});
```
***Defining a ***`Before`*** Hook:***

This before hook is triggered before the "UPDATE_DOCUMENT" action is executed.
The hook listens for the "UPDATE_DOCUMENT" event and accepts a params argument, which typically contains the data being passed for the update. This may include the document's ID, the fields to be updated, and the new values.
The hook logs a message showing the params, allowing you to inspect or modify the update request before it proceeds.

***Purpose***: The before hook allows you to perform pre-update tasks, such as validating the new data, checking permissions, or modifying the update request. For instance, you might want to ensure that certain fields meet specific conditions before allowing the update to proceed.

***`3. Delete Hook`***

In this example, we add custom logic before and after deleting a document  in the Document model.
```typescript
import mercury from "@mercury-js/core";
// Define a before hook for the "update" action
mercury.hook.before("DELETE_DOCUMENT", (params) => {
  console.log("Before deleting a document: ", params);
});

// Define an after hook for the "update" action
mercury.hook.after("DELETE_DOCUMENT", (params, context) => {
  console.log("After document deletion: ", context);
});
```
***Defining a ***`Before`*** Hook:***

The before hook is triggered before the "DELETE_DOCUMENT" action is performed.
This hook listens for the "DELETE_DOCUMENT" event and takes a params argument, which likely contains the document's ID or relevant information about the document that is about to be deleted.
The hook logs a message showing the params, giving you insight into which document is about to be deleted and allowing you to perform checks or logic before deletion occurs.

***Purpose***: This hook allows you to execute logic before deleting the document, such as checking dependencies, performing validations, or preventing the deletion based on certain conditions (e.g., if the document is linked to other important records).

***Defining an ***`After`*** Hook:***
The after hook is triggered after the document has been deleted.
This hook takes two arguments:
params: The data associated with the deletion, typically containing information like the document ID or any related metadata.
context: The context contains information about what happened during the delete operation, such as a success status, a confirmation of the deletion, or any other relevant details after the document is removed.
The hook logs the context to give visibility into the result of the delete operation.

***Purpose***: The after hook is used to execute logic after the document has been deleted, such as logging the deletion, updating related records, sending notifications, or cleaning up any associated data (e.g., removing references to the deleted document).