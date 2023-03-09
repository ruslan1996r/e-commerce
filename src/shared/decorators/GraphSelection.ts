import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GraphSelection = createParamDecorator(
  (data: { root?: string }, ctx: ExecutionContext): GraphSelections[] => {
    try {
      const fieldNodes = GqlExecutionContext.create(ctx).getInfo().fieldNodes;

      if (!fieldNodes || !fieldNodes.length) {
        return [];
      }

      return buildSelection({ root: data && data.root, fieldNodes });
    } catch (error) {
      if (isWrongRoot(error.message)) {
        throw new Error(
          `Probably the Root '${data.root}' in the @GraphSelection is wrong`,
        );
      }
    }
  },
);

const isWrongRoot = (msg: string) =>
  msg === "Cannot read properties of undefined (reading 'selectionSet')";

/**
 * @description Эта функция нужна для случаев, когда джоин выполняется для вложенного поля
 * Например, делаем запрос графом: { total, products, pages } и связь должна работать только для "products"
 */
const buildSelection = ({ root, fieldNodes }) => {
  let selections: GraphSelections[] = [];

  if (root) {
    selections =
      fieldNodes[0].selectionSet?.selections.find(
        (node: { name: { value: string } }) => node.name.value === root,
      ).selectionSet.selections || [];
  } else {
    selections = fieldNodes[0].selectionSet?.selections;
  }

  return selections;
};

export type GraphSelections = {
  kind: string;
  alias?: string;
  name: {
    kind: string;
    value: string;
    loc: Loc;
  };
  arguments: any[];
  directives: any[];
  selectionSet?: {
    kind: string;
    selections: GraphSelections[];
    loc: Loc;
  };
  loc: Loc;
};

type Loc = { start: number; end: number };
