"use client";
import Image, { ImageProps } from "next/image";
import { Children, ReactNode, cloneElement } from "react";

interface Props extends ImageProps {}

export default function ImageSync(props: Props) {
  // eslint-disable-next-line
  const clonedImage = cloneElement(<Image {...props} />);

  // @ts-ignore
  const oldRender = clonedImage.type.render;

  function newRender(props: any, forwardRef: any) {
    const result = oldRender(props, forwardRef);

    const newChildren: ReactNode[] = [];
    Children.forEach(result.props.children, (child, index) => {
      if (index === 0) {
        const newChild = cloneElement(child, {
          key: index,
          decoding: "sync",
        });
        return newChildren.push(newChild);
      }
      newChildren.push(child);
    });

    const clonedImageWithSync = cloneElement(result, { children: newChildren });

    return clonedImageWithSync;
  }

  // @ts-ignore
  clonedImage.type.render = newRender;

  return clonedImage;
}
