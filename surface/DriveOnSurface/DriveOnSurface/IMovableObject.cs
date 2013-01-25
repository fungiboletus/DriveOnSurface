using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Xna.Framework;

namespace DriveOnSurface
{
    interface IMovableObject
    {
        Vector2 getPosition();

        void setPosition(Vector2 Pos);

        void setPosition(int X, int Y);

        float getRotation();

        void setRotation(float Rot);

        String getID();

    }
}